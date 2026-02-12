import { ROUTES } from "@/constants"
import { type BreadcrumbItem, type PageConfig } from "@/types"

import CustomPageHeading from "@/components/custom-page-heading"

import SaveForm from "../_components/SaveForm"

const breadcrumbs: BreadcrumbItem[] = [
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
    ],
  },
]

const pageConfig: PageConfig<{}> = {
  heading: "Tạo quyền",
}

export default function PermissionSave() {
  return (
    <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
      <CustomPageHeading
        heading={pageConfig.heading}
        breadcrumbs={breadcrumbs}
      />

      <div className="page-container">
        <SaveForm />
      </div>
    </div>
  )
}
