import { FC, PropsWithChildren, ReactNode } from "react"

interface LeftTabsProps {
  leftClassname?: string
  rightClassname?: string
  className?: string
  tabs: ReactNode[]
  children: ReactNode[]
  activeTab: number
  setActiveTab: (index: number) => void
}

export const TabContent = ({ children }: PropsWithChildren) => {
  return <>{children}</>
}

export const LeftTabs: FC<LeftTabsProps> = ({
  leftClassname,
  tabs,
  className,
  rightClassname,
  children,
  activeTab,
  setActiveTab,
}) => {
  if (tabs.length !== children.length) {
    throw new Error("Number of tabs and children must match")
  }

  return (
    <div className={`flex ${className ?? ""}`}>
      <div className={`bg-card min-w-1/4 overflow-hidden rounded ${leftClassname ?? ""}`}>
        <ul className="flex flex-col">
          {tabs.map((tab, index) => (
            <li key={index}>
              <button
                type="button"
                onClick={() => setActiveTab(index)}
                className={`hover:bg-muted focus:bg-accent w-full p-2 ${
                  activeTab === index ? "bg-accent text-primary" : ""
                }`}
              >
                {tab}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={`min-w-3/4 p-2 ${rightClassname ?? ""}`}>{children[activeTab]}</div>
    </div>
  )
}
