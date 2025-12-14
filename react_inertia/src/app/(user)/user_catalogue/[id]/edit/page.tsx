import { ROUTES } from "@/constants"
import AppLayout from "@/layouts/app-layout"
import { type BreadcrumbItem, type PageConfig } from "@/types"

import CustomPageHeading from "@/components/custom-page-heading"
import SaveForm from "@/app/(user)/user_catalogue/_components/SaveForm"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Quản lý nhóm thành viên",
    href: ROUTES.user_catalogue,
  },
  {
    title: "Sửa nhóm thành viên",
    // href: ROUTES.user_catalogue_edit,
    href: ROUTES.void,
  },
]

const pageConfig: PageConfig = {
  heading: "Sửa nhóm thành viên",
}

export default function UserCatalogueEdit() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
        <CustomPageHeading
          heading={pageConfig.heading}
          breadcrumbs={breadcrumbs}
        />

        <div className="page-container">
          <SaveForm isEdit />
        </div>
      </div>
    </AppLayout>
  )
}
