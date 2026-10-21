import { FC, useEffect } from "react"
import { toast } from "sonner"
import { useLocation } from "wouter"
import { create } from "zustand"

export type DialogProps = { isOpen: boolean; onOpenChange: (open: boolean) => void }

// Must be a stable, module-level function: it identifies the dialog's slot.
export type DialogLoader<P> = () => Promise<FC<P & DialogProps>>

type Entry = { Component: FC<DialogProps>; props: object; isOpen: boolean; key: number }

// One slot per dialog. A closed entry stays mounted so the dialog can animate out, and is replaced on the next open
// with a fresh key, so no state carries over from the previous use.
const useDialogs = create<{ entries: Map<DialogLoader<never>, Entry> }>(() => ({ entries: new Map() }))

let nextKey = 0

const update = (change: (entries: Map<DialogLoader<never>, Entry>) => void) =>
  useDialogs.setState(({ entries }) => {
    const next = new Map(entries)
    change(next)
    return { entries: next }
  })

export const openDialog = <P extends object>(load: DialogLoader<P>, props: P) =>
  void load().then(
    Component =>
      update(entries =>
        entries.set(load, { Component: Component as FC<DialogProps>, props, isOpen: true, key: nextKey++ })
      ),
    () => toast.error("Could not open this dialog. Check your connection and try again.")
  )

const close = (load: DialogLoader<never>) =>
  update(entries => {
    const entry = entries.get(load)
    if (entry) entries.set(load, { ...entry, isOpen: false })
  })

export const DialogHost: FC = () => {
  const entries = useDialogs(state => state.entries)
  const [location] = useLocation()

  // Start with a clear state on initial load
  useEffect(() => useDialogs.setState({ entries: new Map() }), [])

  // Navigating closes dialogs
  useEffect(
    () => update(entries => entries.forEach((entry, load) => entries.set(load, { ...entry, isOpen: false }))),
    [location]
  )

  return [...entries].map(([load, { Component, props, isOpen, key }]) => (
    <Component key={key} {...props} isOpen={isOpen} onOpenChange={open => !open && close(load)} />
  ))
}
