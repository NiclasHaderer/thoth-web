import { FC, MouseEventHandler, useState } from "react"

export const ProgressBar: FC<{
  className?: string
  percentage: number | undefined
  onChange?: (percentage: number) => void | undefined
}> = ({ percentage, onChange, className }) => {
  const [width, setWidth] = useState(percentage)
  const [prevPercentage, setPrevPercentage] = useState(percentage)
  if (percentage !== prevPercentage) {
    setPrevPercentage(percentage)
    setWidth(percentage)
  }

  const change: MouseEventHandler<HTMLElement> = e => {
    const w = e.pageX / window.innerWidth
    onChange && onChange(w)
    setWidth(w)
  }

  return (
    <div className={`h-1.5 cursor-pointer bg-gray-800 ${className}`} onClick={change}>
      <div
        className={"bg-primary absolute top-0 bottom-0 left-0 transition-all duration-500"}
        style={{ width: `${width ? width * 100 : 0}%` }}
      />
    </div>
  )
}
