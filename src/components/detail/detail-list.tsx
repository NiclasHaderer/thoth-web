import { entityLink } from "@/components/detail/detail-layout.tsx"
import { Button, buttonVariants } from "@/components/ui/button.tsx"
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu.tsx"
import { FC, useLayoutEffect, useRef, useState } from "react"
import { Link } from "wouter"

export interface DetailListItem {
  key: string
  label: string
  href?: string
}
export const DetailList: FC<{ items: DetailListItem[]; prefix?: string }> = ({ items, prefix }) => {
  const rowRef = useRef<HTMLSpanElement>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const [fitting, setFitting] = useState(items.length)
  const total = items.length
  const signature = items.map(item => item.label).join("|")

  useLayoutEffect(() => {
    const row = rowRef.current
    const measure = measureRef.current
    if (!row || !measure) return

    const fit = () => {
      const widths = Array.from(measure.children, child => child.getBoundingClientRect().width)
      const toggle = widths.pop() ?? 0
      const lead = prefix ? (widths.shift() ?? 0) : 0
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0
      const available = row.clientWidth
      const grow = (used: number, width: number) => used + (used > 0 ? gap : 0) + width

      if (widths.reduce(grow, lead) <= available) return setFitting(total)

      let used = lead
      let count = 0
      for (const width of widths) {
        if (grow(used, width) + gap + toggle > available) break
        used = grow(used, width)
        count++
      }
      setFitting(Math.max(count, 1))
    }

    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(row)
    return () => observer.disconnect()
  }, [signature, prefix, total])

  const visible = items.slice(0, fitting)
  const hidden = total - visible.length

  return (
    <span ref={rowRef} className="justify-[inherit] relative flex w-full flex-wrap items-baseline gap-x-1">
      {prefix ? <span className="text-muted-foreground">{prefix}</span> : null}

      {visible.map((item, index) => (
        <span key={item.key} className="whitespace-nowrap">
          {item.href ? (
            <Link href={item.href} className={entityLink}>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
          {index < visible.length - 1 || hidden > 0 ? "," : ""}
        </span>
      ))}

      {hidden > 0 ? (
        <DropdownMenuTrigger>
          <Button variant="ghost" size="xs" className="text-muted-foreground -my-0.5 font-normal">
            +{hidden} more
          </Button>
          <DropdownMenu
            placement="bottom start"
            className="max-h-72 w-max max-w-[min(28rem,calc(100vw-2rem))] min-w-40"
          >
            {items.map(item => (
              <DropdownMenuItem key={item.key} href={item.href} textValue={item.label}>
                <span className="min-w-0 truncate">{item.label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenu>
        </DropdownMenuTrigger>
      ) : null}

      <span aria-hidden className="pointer-events-none absolute top-0 left-0 h-0 w-full overflow-hidden">
        <span ref={measureRef} className="flex w-max">
          {prefix ? <span>{prefix}</span> : null}
          {items.map(item => (
            <span key={item.key}>{item.label},</span>
          ))}
          <span className={buttonVariants({ variant: "ghost", size: "xs" })}>+{total} more</span>
        </span>
      </span>
    </span>
  )
}
