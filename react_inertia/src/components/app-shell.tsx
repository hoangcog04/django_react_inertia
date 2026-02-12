// import { usePage } from "@inertiajs/react"

import { SidebarProvider } from "@/components/ui/sidebar"

interface AppShellProps {
  children: React.ReactNode
  variant?: "header" | "sidebar"
  defaultOpen?: boolean
}

export function AppShell({
  children,
  variant = "header",
  defaultOpen = false,
}: AppShellProps) {
  // const isOpen = usePage<SharedData>().props.sidebarOpen

  if (variant === "header") {
    return <div className="flex min-h-screen w-full flex-col">{children}</div>
  }

  // temp: always close the sidebar
  return <SidebarProvider defaultOpen={defaultOpen}>{children}</SidebarProvider>
}
