export interface JwtHeader {
  alg: string
  typ: string
  kid: string
}

export type JwtPayload = {
  iss: string
  username: string
  edit: boolean
  admin: boolean
  sub: string
  type: "access"
  exp: number
}

export interface Jwt {
  header: JwtHeader
  payload: JwtPayload
}

export const decodeJWT = (jwt: string): Jwt => {
  const [header, payload] = jwt.split(".")
  return {
    header: JSON.parse(window.atob(header)) as JwtHeader,
    payload: JSON.parse(window.atob(payload)) as JwtPayload,
  }
}

export const isExpired = (jwt: Jwt): boolean => {
  return jwt.payload.exp * 1000 < Date.now()
}
