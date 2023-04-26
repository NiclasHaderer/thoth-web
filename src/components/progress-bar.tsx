import { FC, MouseEventHandler, useEffect, useState } from "react"

export const ProgressBar: FC<{
  className?: string
  percentage: number | undefined
  onChange?: (percentage: number) => void | undefined
}> = ({ percentage, onChange, className }) => {
  const [width, setWidth] = useState(percentage)
  useEffect(() => setWidth(percentage), [percentage])

  const change: MouseEventHandler<HTMLElement> = e => {
    const w = e.pageX / window.innerWidth
    onChange && onChange(w)
    setWidth(w)
  }

  return (
    <div className={`bg-gray-800 h-1.5 cursor-pointer ${className}`} onClick={change}>
      <div
        className={"absolute bottom-0 left-0 top-0 bg-primary transition-all duration-500"}
        style={{ width: `${width ? width * 100 : 0}%` }}
      />
    </div>
  )
}
