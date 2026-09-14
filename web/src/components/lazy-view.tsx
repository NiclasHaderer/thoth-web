import { Component, FC, ReactNode, Suspense, lazy, useCallback, useEffect, useState } from "react"
import { Button } from "@thoth/components/ui/button"
import { isOnline } from "@thoth/hooks/online"

type Loader<P> = () => Promise<{ default: FC<P> }>

const resident = new WeakSet<object>()

export const preloadView = (load: () => Promise<unknown>) => {
  if (resident.has(load) || !isOnline()) return
  void load().then(
    () => resident.add(load),
    () => undefined
  )
}

class LoadBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}

const LoadFailed: FC<{ retry: () => void }> = ({ retry }) => {
  useEffect(() => {
    window.addEventListener("online", retry)
    return () => window.removeEventListener("online", retry)
  }, [retry])

  return (
    <div className="text-muted-foreground flex flex-col items-center gap-3 py-12 text-center text-sm">
      <p>{isOnline() ? "Could not load this view" : "Not available offline"}</p>
      <Button variant="outline" size="sm" onPress={retry}>
        Try again
      </Button>
    </div>
  )
}

export const lazyView = <P extends object>(
  load: Loader<P>,
  renderSkeleton?: (props: NoInfer<P>) => ReactNode
): FC<P> => {
  const whenReachable: Loader<P> = async () => {
    if (!resident.has(load) && !isOnline()) throw new Error("Offline, refusing to request the module")
    const view = await load()
    resident.add(load)
    return view
  }

  return props => {
    const [state, setState] = useState(() => ({ attempt: 0, View: lazy(whenReachable) }))

    const retry = useCallback(
      () => setState(previous => ({ attempt: previous.attempt + 1, View: lazy(whenReachable) })),
      []
    )

    return (
      <LoadBoundary key={state.attempt} fallback={<LoadFailed retry={retry} />}>
        <Suspense fallback={renderSkeleton?.(props)}>
          <state.View {...props} />
        </Suspense>
      </LoadBoundary>
    )
  }
}
