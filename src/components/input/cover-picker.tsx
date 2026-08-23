import { ImageOffIcon } from "lucide-react"
import { FC, useRef } from "react"
import { ResponsiveImage } from "@thoth/components/responsive-image"
import { Button } from "@thoth/components/ui/button"
import { isUUID, toBase64 } from "@thoth/utils/utils"

export const CoverPicker: FC<{
  alt: string
  value: string | undefined
  onChange: (cover: string) => void
}> = ({ alt, value, onChange }) => {
  const imageRef = useRef<HTMLInputElement>(null)
  const openPicker = () => imageRef.current && imageRef.current.click()
  return (
    <div className="flex items-center justify-center pr-2">
      <div className="flex flex-col">
        {value ? (
          <ResponsiveImage
            className="h-52 min-h-52 w-52 min-w-52 cursor-pointer rounded-md lg:h-72 lg:min-h-72 lg:w-72 lg:min-w-72"
            src={isUUID(value) ? `/api/stream/images/${value}` : value}
            alt={alt}
            onClick={openPicker}
          />
        ) : (
          <ImageOffIcon className="h-52 w-52 cursor-pointer rounded-md lg:h-72 lg:w-72" onClick={openPicker} />
        )}
        <input
          className="hidden"
          ref={imageRef}
          type="file"
          accept="image/*"
          onChange={async () => {
            const file = imageRef.current!.files![0]
            onChange(await toBase64(file))
          }}
        />
        <Button variant="secondary" className="mt-2 self-center" onPress={openPicker}>
          Upload image
        </Button>
      </div>
    </div>
  )
}
