"use client"

import { useMemo } from "react"
import Link from "next/link"
import { ROUTES } from "@/constants"
import { chooseAll, filter } from "@/constants/filter"
import AppLayout from "@/layouts/app-layout"
import { useUserCatalogue } from "@/services/useUserCatalogue"
import { IFilter, PageConfig, type BreadcrumbItem } from "@/types"
import { PlusCircle } from "lucide-react"

import { useFilter } from "@/hooks/use-filter"
import { Button } from "@/components/ui/button"
import CustomCard from "@/components/custom-card"
import CustomFilter from "@/components/custom-filter"
import CustomPageHeading from "@/components/custom-page-heading"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Dashboard",
    href: ROUTES.dashboard,
  },
  {
    title: "Quản lý nhóm thành viên",
    href: ROUTES.user_catalogue,
  },
]

const pageConfig: PageConfig = {
  heading: "Quản lý nhóm thành viên",
  cardHeading: "Bảng quản lý danh sách nhóm thành viên",
  cardDescription:
    "Quản lý thông tin danh sách nhóm thành viên, sử dụng các chức năng để lọc dữ liệu",
  filters: [...filter],
}

export default function UserCatalogue() {
  const { useGetUserList } = useUserCatalogue()
  const { data, isPending } = useGetUserList()
  const users = data?.results
  const allFilters = useFilter({
    pageConfig,
    users,
    statusFilters: new Map([["user_id", isPending]]),
  })

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="page-wrapper flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl">
        <CustomPageHeading
          heading={pageConfig.heading}
          breadcrumbs={breadcrumbs}
        />

        <div className="page-container">
          <CustomCard
            isShowFooter
            title={pageConfig.cardHeading}
            description={pageConfig.cardDescription}
          >
            <div className="mb-2.5 flex items-center justify-between">
              <CustomFilter filters={allFilters} />
              <Link href={ROUTES.user_catalogue_create}>
                <Button className="rounded-[5px] bg-[#ed5565] shadow hover:bg-[#ed5565]/80">
                  <PlusCircle />
                  <span>Thêm nhóm thành viên</span>
                </Button>
              </Link>
            </div>
          </CustomCard>
        </div>
      </div>
    </AppLayout>
  )
}
