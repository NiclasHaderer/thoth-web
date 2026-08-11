import { FC, ReactNode } from "react"

export const SettingsSection: FC<{ title: string; description?: ReactNode; children: ReactNode }> = ({
  title,
  description,
  children,
}) => (
  <>
    <h2 className={description ? "mb-1 text-xl" : "mb-4 text-xl"}>{title}</h2>
    {description ? <p className="text-muted-foreground mb-6 text-sm">{description}</p> : null}
    {children}
  </>
)
