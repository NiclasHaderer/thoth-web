export type KeyOfType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never
}[keyof T]


export type Param<T extends object,
  K extends KeyOfType<T, (...args: any) => any>,
  P extends (...args: any) => any = T[K] extends (...args: any) => any ? T[K] : (...args: any) => any> = Parameters<P>[0];
