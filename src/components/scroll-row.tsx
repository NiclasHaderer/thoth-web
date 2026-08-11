import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { FC, PropsWithChildren, useEffect, useRef, useState } from "react"
import { Link } from "wouter"
import { Button } from "@thoth/components/ui/button"

export const ScrollRow: FC<PropsWithChildren<{ title: string; href: string }>> = ({ title, href, children }) => {
  const scroller = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(true)
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    const element = scroller.current
    const inner = content.current
    if (!element || !inner) return

    const update = () => {
      setAtStart(element.scrollLeft <= 1)
      setAtEnd(element.scrollLeft + element.clientWidth >= element.scrollWidth - 1)
      setScrollable(element.scrollWidth > element.clientWidth + 1)
    }

    element.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    observer.observe(inner)
    return () => {
      element.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [])

  const scrollByPage = (direction: 1 | -1) => {
    const element = scroller.current
    if (!element) return
    element.scrollBy({ left: direction * Math.round(element.clientWidth * 0.8), behavior: "smooth" })
  }

  return (
    <>
      <div className="mt-8 mb-2 flex items-center gap-1">
        <Link
          className="block w-fit text-xl font-bold decoration-1 hover:underline focus-visible:underline focus-visible:outline-none"
          href={href}
        >
          {title}
        </Link>
        {scrollable ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Scroll ${title} left`}
              isDisabled={atStart}
              onPress={() => scrollByPage(-1)}
              className="ml-auto rounded-full disabled:opacity-30"
            >
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Scroll ${title} right`}
              isDisabled={atEnd}
              onPress={() => scrollByPage(1)}
              className="rounded-full disabled:opacity-30"
            >
              <ChevronRightIcon />
            </Button>
          </>
        ) : null}
      </div>
      <div
        ref={scroller}
        className="-mx-1 -my-2 [scrollbar-width:none] overflow-auto px-1 py-2 whitespace-nowrap [&::-webkit-scrollbar]:hidden"
      >
        <div ref={content} className="w-max">
          {children}
        </div>
      </div>
    </>
  )
}
