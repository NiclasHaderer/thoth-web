import React, { MouseEventHandler, useEffect, useState } from "react"

export const ProgressBar: React.VFC<{
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
    <div className={`h-1.5 cursor-pointer bg-gray-800 ${className}`} onClick={change}>
      <div
        className={"absolute left-0 top-0 bottom-0 bg-primary transition-all duration-500"}
        style={{ width: `${width ? width * 100 : 0}%` }}
      />
    </div>
  )
}
