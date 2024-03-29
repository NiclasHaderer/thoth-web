import { SVGAttributes } from "react"

export const MdScan = (props: SVGAttributes<SVGElement>) => {
  return (
    <svg
      {...props}
      stroke="currentColor"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      height="1em"
      viewBox="0 96 960 960"
      width="1em"
    >
      <path d="M220 976q-24.75 0-42.375-17.625T160 916V746h60v170h520V746h60v170q0 24.75-17.625 42.375T740 976H220Zm-60-410V236q0-24.75 17.625-42.375T220 176h361l219 219v171h-60V422H551V236H220v330h-60ZM40 686v-60h880v60H40Zm440-120Zm0 180Z" />
    </svg>
  )
}
