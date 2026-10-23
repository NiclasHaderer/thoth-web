import { DetailedHTMLProps, FC, ImgHTMLAttributes, useRef } from "react"

interface ResponsiveImageProps extends DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  src: string
}

export const ResponsiveImage: FC<ResponsiveImageProps> = ({ src, ...props }) => {
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
