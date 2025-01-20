import React, { useRef } from "react"

interface ResponsiveImageProps
  extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  src: string
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({ src, ...props }) => {
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
