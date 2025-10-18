import type { ReactNode } from "react"
// import { Sidebar } from "./Sidebar"
import TopbarComp from './topbar'
import SidePanelComp from "./sidePanel"

interface AppWrapperProps {
    children: ReactNode
}

export function AppWrapperComp({ children }: AppWrapperProps) {
    return (
        <div className="flex flex-col h-screen bg-white">
            <TopbarComp />
            <div className="flex flex-1">
                <SidePanelComp />
                <main className="flex-1 overflow-auto pt-20">{children}</main>
            </div>
        </div>
    )
}