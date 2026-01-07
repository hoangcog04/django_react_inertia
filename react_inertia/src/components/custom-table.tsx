import React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "./ui/input"
import { Skeleton } from "./ui/skeleton"
import { Spinner } from "./ui/spinner"

interface IColumn {
  key: string
  label: string
  className?: string
}

type CustomTableProps<T> = {
  columns?: IColumn[]
  data?: T[]
  render: (item: T) => React.ReactNode
  isLoading?: boolean
  isRefreshing?: boolean
}
const CustomTable = <T,>({
  columns,
  data = [],
  render,
  isLoading,
  isRefreshing,
}: CustomTableProps<T>) => {
  return (
    <Table className="relative mt-[30px] w-full rounded-md border">
      {isRefreshing && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
          <Spinner />
        </div>
      )}
      <TableHeader className="bg-gray-200">
        <TableRow>
          {columns?.map((column) => (
            <TableHead key={column.key} className={column.className}>
              {column.key === "checkbox" ? (
                <Input type="checkbox" className="size-4" />
              ) : (
                column.label
              )}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={columns?.length}>
              <Skeleton className="h-20 w-full" />
            </TableCell>
          </TableRow>
        )}
        {!isLoading && data?.length === 0 ? (
          <>
            <TableRow>
              <TableCell
                colSpan={columns?.length}
                className="text-center font-medium text-red-600"
              >
                Không tìm thấy dữ liệu phù hợp
              </TableCell>
            </TableRow>
          </>
        ) : (
          data?.map((item) => render(item))
        )}
      </TableBody>
    </Table>
  )
}

export default CustomTable
