import { FC, PropsWithChildren, ReactNode, useState } from "react"

interface LeftTabsProps {
  leftClassname?: string
  rightClassname?: string
  className?: string
  tabs: ReactNode[]
  children: ReactNode[]
}

export const TabContent = ({ children }: PropsWithChildren) => {
  return <>{children}</>
}

export const LeftTabs: FC<LeftTabsProps> = ({ leftClassname, tabs, className, rightClassname, children }) => {
  if (tabs.length !== children.length) {
    throw new Error("Number of tabs and children must match")
  }

  const [activeTab, setActiveTab] = useState(0)

  return (
    <div className={`flex ${className ?? ""}`}>
      <div className={`min-w-1/4 bg-elevate ${leftClassname ?? ""}`}>
        <ul className="flex flex-col">
          {tabs.map((tab, index) => (
            <li key={index}>
              <button
                onClick={() => setActiveTab(index)}
                className={`w-full p-2 hover:bg-active-light focus:bg-active ${
                  activeTab === index ? "bg-active text-primary" : ""
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
