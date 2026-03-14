"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ROUTES } from "@/constants"
import { filter } from "@/constants/filter"
import {
  IPermissionList,
  IPermissionSave,
  PermissionBulkUpdateReq,
  useBulkDeletePermission,
  useBulkUpdatePermission,
  useGetPermissionList,
  usePermission,
  useUpdatePermission,
} from "@/services/use-permission"
import { useUserCatalogue } from "@/services/use-user-catalogue"
import { PageConfig, type BreadcrumbItem } from "@/types"
import { formatDateTime } from "@/utils/date"
import { UseMutateFunction } from "@tanstack/react-query"
import { Edit, PlusCircle } from "lucide-react"

import { useFilter } from "@/hooks/use-filter"
import { SingleSwitchState } from "@/hooks/use-switch"
import useTable from "@/hooks/use-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { TableCell, TableRow } from "@/components/ui/table"
import CustomBulkAction from "@/components/custom-bulk-action"
import CustomCard from "@/components/custom-card"
import CustomConfirmDelete from "@/components/custom-confirm-delete"
import CustomFilter from "@/components/custom-filter"
import CustomPageHeading from "@/components/custom-page-heading"
import { CustomPagination } from "@/components/custom-pagination"
import CustomTable from "@/components/custom-table"

const breadcrumbs: BreadcrumbItem[] = [
  {
    key: "permission",
    title: "Quản lý quyền",
    href: ROUTES.permission,
  },
]

const pageConfig: PageConfig<IPermissionList> = {
  heading: "Quản lý quyền",
  cardHeading: "Bảng quản lý danh sách quyền",
  cardDescription:
    "Quản lý thông tin danh sách quyền, sử dụng các chức năng để lọc dữ liệu",
  filters: [...filter],
  columns: [
    { key: "checkbox", label: "", className: "w-[60px]" },
    { key: "id", label: "ID", className: "w-[100px]" },
    { key: "name", label: "Tên quyền", className: "w-[25%]" },
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
type UpdatePermissionFn = UseMutateFunction<
  any,
  Error,
  { id: string; data: IPermissionSave },
  unknown
>

type TableRowComponentProps = {
  // handling API data
  item: IPermissionList
  isSelected: boolean
  switchState: SingleSwitchState<SwitchField>
  // handling UI actions
  renderDeleteAction?: (item: IPermissionList) => React.ReactNode
  mustBeMemoOnSwitchChange: (
    id: string,
    field: SwitchField,
    currentValue: string
  ) => void
  mustBeMemoOnSelectOne: (id: string, checked: boolean) => void
}
const TableRowComponent = React.memo(
  ({
    item,
    isSelected,
    switchState,
    renderDeleteAction,
    mustBeMemoOnSwitchChange,
    mustBeMemoOnSelectOne,
  }: TableRowComponentProps) => {
    // in first time, the hook doesn't contain the item.id state
    // use the data from the API
    const effectiveSwitches = switchState?.values.publish ?? item.publish
    const isLoading = switchState?.loading ?? false

    return (
      <>
        <TableRow
          key={item.id}
          className={`cursor-pointer hover:bg-gray-200/20 ${isSelected ? "bg-[#ffc] hover:bg-[#ffc]" : ""}`}
        >
          <TableCell className="font-medium">
            <Input
              type="checkbox"
              className="size-4"
              checked={isSelected}
              onChange={(e) => {
                mustBeMemoOnSelectOne(item.id, e.target.checked)
              }}
            />
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
              checked={String(effectiveSwitches) === "2" ? false : true}
              onCheckedChange={() => {
                mustBeMemoOnSwitchChange(
                  item.id,
                  "publish",
                  String(effectiveSwitches) === "2" ? "2" : "1"
                )
              }}
              disabled={isLoading}
              className="cursor-pointer"
            />
          </TableCell>
          <TableCell className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Link href={ROUTES.permission_edit(item.id)}>
                <Button
                  type="button"
                  className="size-7 cursor-pointer rounded-[5px] bg-[#0088FF] p-0"
                >
                  <Edit />
                </Button>
              </Link>
              {renderDeleteAction?.(item)}
            </div>
          </TableCell>
        </TableRow>
      </>
    )
  }
)
TableRowComponent.displayName = "TableRowComponent"

type DeleteActionComponentProps = {
  item: IPermissionList
}
const DeleteActionComponent = ({ item }: DeleteActionComponentProps) => {
  const { useDeletePermission } = usePermission()
  const { mutate: deletePermission, isPending: isDeletePermissionPending } =
    useDeletePermission()

  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    deletePermission(item.id, {
      onSuccess: () => {
        setOpen(false)
      },
    })
  }

  return (
    <CustomConfirmDelete
      onConfirm={handleDelete}
      isLoading={isDeletePermissionPending}
      open={open}
      setOpen={setOpen}
    />
  )
}
const renderDeleteAction = (item: IPermissionList) => (
  <DeleteActionComponent item={item} />
)

type BulkActionComponentProps = {
  selectedIds: string[]
  setSelectedIds: (ids: string[]) => void
}
const BulkActionComponent = ({
  selectedIds,
  setSelectedIds,
}: BulkActionComponentProps) => {
  const {
    mutateAsync: bulkDeletePermission,
    isPending: isBulkDeletePermissionPending,
  } = useBulkDeletePermission()
  const {
    mutateAsync: bulkUpdatePermission,
    isPending: isBulkUpdatePermissionPending,
  } = useBulkUpdatePermission()

  const handleBulkDelete = async (ids: string[]) => {
    await bulkDeletePermission({ ids })
  }

  const handleBulkUpdate = async (data: PermissionBulkUpdateReq) => {
    await bulkUpdatePermission(data)
  }

  return (
    <CustomBulkAction
      selectedIds={selectedIds}
      setSelectedIds={setSelectedIds}
      actions={[
        {
          label: "Xóa nhiều bản ghi",
          confirm: true,
          confirmTitle: "Xác nhận xóa nhiều bản ghi",
          confirmDescription:
            "Lưu ý: Hành động này là không thể đảo ngược, hãy chắc chắn bạn muốn thực hiện hành động này",
          run: (ids: string[]) => handleBulkDelete(ids),
        },
        {
          label: "Cập nhật trạng thái: Bật",
          run: (ids: string[]) => handleBulkUpdate({ ids, publish: 2 }),
        },
        {
          label: "Cập nhật trạng thái: Tắt",
          run: (ids: string[]) => handleBulkUpdate({ ids, publish: 1 }),
        },
      ]}
    />
  )
}
const renderBulkAction = (
  selectedIds: string[],
  setSelectedIds: (ids: string[]) => void
) => (
  <BulkActionComponent
    selectedIds={selectedIds}
    setSelectedIds={setSelectedIds}
  />
)

const Permission = () => {
  const searchParams = useSearchParams()

  const { useGetUserList } = useUserCatalogue()
  const { mutate: updatePermission } = useUpdatePermission()
  const { data: userListData, isPending: isUserListPending } = useGetUserList()
  const {
    data: permissionListData,
    isPending: isPermissionListPending,
    isFetching: isPermissionListFetching,
  } = useGetPermissionList(searchParams.toString())

  const users = userListData?.results
  const allFilters = useFilter({
    pageFilters: pageConfig.filters,
    users,
    statusFilters: new Map([["creator_id", isUserListPending]]),
  })

  const {
    selectedIds,
    isAllSelected,
    setSelectedIds,
    handleSwitchChange,
    handleSelectAll,
    handleSelectOne,
    getSwitchState,
  } = useTable<IPermissionList, UpdatePermissionFn>({
    pageConfig,
    mustBeMemoMutateFnUsedBySwitch: updatePermission,
    records: permissionListData?.results ?? [],
  })

  return (
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
              records={permissionListData}
              rootPath={ROUTES.permission}
            />
          }
        >
          <div className="mb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-[10px]">
              {selectedIds.length > 0 &&
                renderBulkAction(selectedIds, setSelectedIds)}
              <CustomFilter
                filters={allFilters}
                searchParams={searchParams}
                isLoading={isPermissionListPending}
                rootPath={ROUTES.permission}
              />
            </div>
            <Link href={ROUTES.permission_save}>
              <Button className="rounded-[5px] bg-[#ed5565] shadow hover:bg-[#ed5565]/80">
                <PlusCircle />
                <span>Thêm quyền</span>
              </Button>
            </Link>
          </div>
          <CustomTable
            columns={[
              {
                key: "checkbox",
                label: (
                  <Input
                    type="checkbox"
                    className="size-4 cursor-pointer bg-red-500"
                    checked={isAllSelected}
                    onChange={(e) => {
                      handleSelectAll(e.target.checked)
                    }}
                  />
                ),
                className: "w-[60px]",
              },
              ...(pageConfig.columns ?? []).filter(
                (col) => col.key !== "checkbox"
              ),
            ]}
            data={permissionListData?.results}
            render={(item) => (
              <TableRowComponent
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                switchState={getSwitchState(item.id)}
                renderDeleteAction={renderDeleteAction}
                mustBeMemoOnSwitchChange={handleSwitchChange}
                mustBeMemoOnSelectOne={handleSelectOne}
              />
            )}
            isLoading={isPermissionListPending}
            isRefreshing={!isPermissionListPending && isPermissionListFetching}
          />
        </CustomCard>
      </div>
    </div>
  )
}

export default function PermissionPage() {
  return (
    <Suspense fallback={<Skeleton className="h-full w-full" />}>
      <Permission />
    </Suspense>
  )
}
