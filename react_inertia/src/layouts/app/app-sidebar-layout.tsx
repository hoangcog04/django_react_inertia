import { type PropsWithChildren } from "react"
import { cookies } from "next/headers"
import { type BreadcrumbItem } from "@/types"

import { AppContent } from "@/components/app-content"
import { AppShell } from "@/components/app-shell"
import { AppSidebar } from "@/components/app-sidebar"
import { AppSidebarHeader } from "@/components/app-sidebar-header"

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
  const cookieStore = cookies()
  const sidebarState = cookieStore.get("sidebar_state")
  const defaultOpen = sidebarState?.value === "true" || false

  return (
    <AppShell variant="sidebar" defaultOpen={defaultOpen}>
      <AppSidebar />
      <AppContent variant="sidebar" className="overflow-x-hidden">
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        {children}
      </AppContent>
    </AppShell>
  )
}
