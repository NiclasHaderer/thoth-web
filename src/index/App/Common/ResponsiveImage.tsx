import React, { useRef } from "react"

interface ResponsiveImageProps extends React.HTMLAttributes<HTMLDivElement> {
  callback?: Function
  src: string
}

export const ResponsiveImage: React.VFC<ResponsiveImageProps> = ({ src, ...props }) => {
  const element = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={element}
      {...props}
      style={{ backgroundImage: `url(${src})` }}
      className={`overflow-hidden bg-contain bg-center bg-no-repeat ${props.className}`}
    />
  )
}
