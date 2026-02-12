import { ROUTES } from "@/constants"
import { type BreadcrumbItem, type PageConfig } from "@/types"

import CustomPageHeading from "@/components/custom-page-heading"

import SaveForm from "../../_components/SaveForm"

const breadcrumbs: BreadcrumbItem[] = [
  {
    key: "user_catalogue",
    title: "Quản lý nhóm thành viên",
    href: ROUTES.user_catalogue,
    items: [
      {
        key: "edit",
        title: "Sửa nhóm thành viên",
        // href: ROUTES.void,
        href: "/user_catalogue/61/edit",
      },
    ],
  },
]

const pageConfig: PageConfig<{}> = {
  heading: "Sửa nhóm thành viên",
}

export default function UserCatalogueEdit() {
  return (
    <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
      <CustomPageHeading
        heading={pageConfig.heading}
        breadcrumbs={breadcrumbs}
      />

      <div className="page-container">
        <SaveForm isEdit />
      </div>
    </div>
  )
}
