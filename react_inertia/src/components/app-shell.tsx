// import { usePage } from "@inertiajs/react"

import { SidebarProvider } from "@/contexts/sidebar-provider"
import { SharedData } from "@/types"

interface AppShellProps {
  children: React.ReactNode
  variant?: "header" | "sidebar"
}

export function AppShell({ children, variant = "header" }: AppShellProps) {
  // const isOpen = usePage<SharedData>().props.sidebarOpen

  if (variant === "header") {
    return <div className="flex min-h-screen w-full flex-col">{children}</div>
  }

  // temp: always open the sidebar
  return <SidebarProvider defaultOpen={false}>{children}</SidebarProvider>
}
