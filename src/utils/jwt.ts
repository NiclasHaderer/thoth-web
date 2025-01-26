import { UserPermissionsModel } from "@thoth/client"

export interface JwtHeader {
  alg: string
  typ: string
  kid: string
}

export type JwtPayload = {
  exp: number
  iss: string
  sub: string
  type: "access"

  permissions: UserPermissionsModel
}

export interface Jwt {
  header: JwtHeader
  payload: JwtPayload
}

export const decodeJWT = (jwt: string): Jwt => {
  const [header, payload] = jwt.split(".")
  const pay = JSON.parse(window.atob(payload))
  return {
    header: JSON.parse(window.atob(header)) as JwtHeader,
    payload: {
      ...pay,
      permissions: JSON.parse(pay.permissions) as UserPermissionsModel,
    } as JwtPayload,
  }
}

export const isExpired = (jwt: Jwt): boolean => {
  return jwt.payload.exp * 1000 < Date.now()
}
