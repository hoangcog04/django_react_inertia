"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ROUTES } from "@/constants"
import { filter } from "@/constants/filter"
import AppLayout from "@/layouts/app-layout"
import {
  useUpdateUserCatalogue,
  useUserCatalogue,
} from "@/services/useUserCatalogue"
import { PageConfig, type BreadcrumbItem } from "@/types"
import { formatDateTime } from "@/utils/date"
import { UseMutateFunction } from "@tanstack/react-query"
import { Edit, PlusCircle, Trash2 } from "lucide-react"

import { IUserCatalogueList, IUserCatalogueSave } from "@/types/schema"
import { useFilter } from "@/hooks/use-filter"
import useSwitch, { SwitchState } from "@/hooks/use-switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { TableCell, TableRow } from "@/components/ui/table"
import CustomCard from "@/components/custom-card"
import CustomConfirmDelete from "@/components/custom-confirm-delete"
import CustomFilter from "@/components/custom-filter"
import CustomPageHeading from "@/components/custom-page-heading"
import { CustomPagination } from "@/components/custom-pagination"
import CustomTable from "@/components/custom-table"

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

const pageConfig: PageConfig<IUserCatalogueList> = {
  heading: "Quản lý nhóm thành viên",
  cardHeading: "Bảng quản lý danh sách nhóm thành viên",
  cardDescription:
    "Quản lý thông tin danh sách nhóm thành viên, sử dụng các chức năng để lọc dữ liệu",
  filters: [...filter],
  columns: [
    { key: "checkbox", label: "", className: "w-[60px]" },
    { key: "id", label: "ID", className: "w-[100px]" },
    { key: "name", label: "Tên nhóm", className: "w-[25%]" },
    { key: "description", label: "Mô tả", className: "" },
    { key: "creator", label: "Người tạo", className: "text-center" },
    { key: "created_at", label: "Ngày tạo", className: "text-center" },
    { key: "updated_at", label: "Ngày sửa", className: "text-center" },
    { key: "publish", label: "Trạng thái", className: "text-center" },
    { key: "actions", label: "Thao tác", className: "w-[120px] text-center" },
  ],
  switches: ["publish"],
}

type SwitchField = NonNullable<typeof pageConfig.switches>[number]
type UpdateUserCatalogueFn = UseMutateFunction<
  any,
  Error,
  { id: string; data: IUserCatalogueSave },
  unknown
>

type TableRowComponentProps = {
  // handling API data
  item: IUserCatalogueList
  switches: SwitchState<SwitchField>
  // handling UI actions
  renderDeleteAction?: React.ReactNode
  onSwitchChange: (
    id: string,
    field: SwitchField,
    currentValue: string | number
  ) => void
}
const TableRowComponent = React.memo(
  ({
    item,
    renderDeleteAction,
    switches,
    onSwitchChange,
  }: TableRowComponentProps) => {
    // in first time, the hook doesn't contain the item.id state
    // use the data from the API
    const effectiveSwitches = switches[item.id]?.values.publish ?? item.publish
    const isLoading = switches[item.id]?.loading ?? false

    return (
      <>
        <TableRow key={item.id}>
          <TableCell className="font-medium">
            <Input type="checkbox" className="size-4" />
          </TableCell>
          <TableCell>{item.id}</TableCell>
          <TableCell>{item.name}</TableCell>
          <TableCell>{item.description}</TableCell>
          <TableCell className="text-center">{item.creator?.name}</TableCell>
          <TableCell className="text-center">
            {formatDateTime(new Date(item.created_at))}
          </TableCell>
          <TableCell className="text-center">
            {formatDateTime(new Date(item.updated_at))}
          </TableCell>
          <TableCell className="text-center">
            <Switch
              checked={effectiveSwitches === 2}
              onCheckedChange={() => {
                onSwitchChange(item.id, "publish", effectiveSwitches)
              }}
              disabled={isLoading}
              className="cursor-pointer"
            />
          </TableCell>
          <TableCell className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Link href={ROUTES.user_catalogue_edit.replace("[id]", item.id)}>
                <Button
                  type="button"
                  className="size-7 cursor-pointer rounded-[5px] bg-[#0088FF] p-0"
                >
                  <Edit />
                </Button>
              </Link>
              {renderDeleteAction}
            </div>
          </TableCell>
        </TableRow>
      </>
    )
  }
)

type DeleteActionComponentProps = {
  item: IUserCatalogueList
}
const DeleteActionComponent = ({ item }: DeleteActionComponentProps) => {
  const { useDeleteUserCatalogue } = useUserCatalogue()
  const {
    mutate: deleteUserCatalogue,
    isPending: isDeleteUserCataloguePending,
  } = useDeleteUserCatalogue()

  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    deleteUserCatalogue(item.id, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  return (
    <CustomConfirmDelete
      onConfirm={handleDelete}
      isLoading={isDeleteUserCataloguePending}
      open={open}
      setOpen={setOpen}
    />
  )
}

const renderDeleteAction = (item: IUserCatalogueList) => (
  <DeleteActionComponent item={item} />
)

export default function UserCatalogue() {
  const searchParams = useSearchParams()

  const { useGetUserList, useGetUserCatalogueList } = useUserCatalogue()
  const { mutate: updateUserCatalogue } = useUpdateUserCatalogue()
  const { data: userListData, isPending: isUserListPending } = useGetUserList()
  const {
    data: userCatalogueListData,
    isPending: isUserCatalogueListPending,
    isFetching: isUserCatalogueListFetching,
  } = useGetUserCatalogueList(`${searchParams.toString()}&ordering=id`)

  const { switches, handleSwitchChange } = useSwitch<
    IUserCatalogueList,
    UpdateUserCatalogueFn
  >({
    mustBeMemoizedOnMutate: updateUserCatalogue,
    switchFields: pageConfig.switches!,
  })

  const users = userListData?.results
  const allFilters = useFilter({
    pageFilters: pageConfig.filters,
    users,
    statusFilters: new Map([["creator_id", isUserListPending]]),
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
            title={pageConfig.cardHeading}
            description={pageConfig.cardDescription}
            isShowFooter
            footerChildren={
              <CustomPagination
                records={userCatalogueListData}
                rootPath={ROUTES.user_catalogue}
              />
            }
          >
            <div className="mb-2.5 flex items-center justify-between">
              <CustomFilter
                filters={allFilters}
                searchParams={searchParams}
                isLoading={isUserCatalogueListPending}
              />
              <Link href={ROUTES.user_catalogue_create}>
                <Button className="rounded-[5px] bg-[#ed5565] shadow hover:bg-[#ed5565]/80">
                  <PlusCircle />
                  <span>Thêm nhóm thành viên</span>
                </Button>
              </Link>
            </div>
            <CustomTable
              columns={pageConfig.columns}
              data={userCatalogueListData?.results}
              render={(item) => (
                <TableRowComponent
                  key={item.id}
                  item={item}
                  renderDeleteAction={renderDeleteAction(item)}
                  switches={switches}
                  onSwitchChange={handleSwitchChange}
                />
              )}
              isLoading={isUserCatalogueListPending}
              isRefreshing={
                !isUserCatalogueListPending && isUserCatalogueListFetching
              }
            />
          </CustomCard>
        </div>
      </div>
    </AppLayout>
  )
}

TableRowComponent.displayName = "TableRowComponent"
