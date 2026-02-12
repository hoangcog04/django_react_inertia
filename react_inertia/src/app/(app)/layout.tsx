import React from "react"
import { ROUTES } from "@/constants"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem } from "@/types"

const breadcrumbs: BreadcrumbItem[] = [
  {
    key: "dashboard",
    title: "Dashboard",
    href: ROUTES.dashboard,
  },
  {
    key: "user_catalogue",
    title: "Quản lý nhóm thành viên",
    href: ROUTES.user_catalogue,
    items: [
      {
        key: "save",
        title: "Tạo nhóm thành viên",
        href: ROUTES.user_catalogue_save,
      },
      {
        key: "edit",
        title: "Sửa nhóm thành viên",
        href: "/user_catalogue/1/edit",
      },
    ],
  },
  {
    key: "permission",
    title: "Quản lý quyền",
    href: ROUTES.permission,
    items: [
      {
        key: "save",
        title: "Tạo quyền",
        href: ROUTES.permission_save,
      },
      {
        key: "edit",
        title: "Sửa quyền",
        href: "/permission/1/edit",
      },
    ],
  },
]

type LayoutProps = {
  children: React.ReactNode
}
export default function layout({ children }: LayoutProps) {
  return <AppLayout breadcrumbs={breadcrumbs}>{children}</AppLayout>
}
