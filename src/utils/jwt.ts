import type { UUID } from "@thoth/client/generated/models"

interface JwtHeader {
  alg: string
  typ: string
  kid: string
}

type JwtPayload = {
  exp: number
  iss: string
  sub: UUID
  type: "access"
}

export interface Jwt {
  header: JwtHeader
  payload: JwtPayload
}

export const decodeJWT = (jwt: string): Jwt => {
  const [header, payload] = jwt.split(".")
  return {
    header: JSON.parse(atob(header)) as JwtHeader,
    payload: JSON.parse(atob(payload)) as JwtPayload,
  }
}
