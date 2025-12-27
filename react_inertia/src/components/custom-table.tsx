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

interface IColumn {
  key: string
  label: string
  className?: string
}

type CustomTableProps<T> = {
  columns?: IColumn[]
  data?: T[]
  render: (item: T) => React.ReactNode
}
const CustomTable = <T,>({ columns, data, render }: CustomTableProps<T>) => {
  return (
    <Table className="mt-[30px] w-full rounded-md border">
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
        {/* UI chung cho tất cả các table khi không có dữ liệu */}
        {data?.length === 0 ? (
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
          // UI riêng được định nghĩa ở từng page
          data?.map((item) => render(item))
        )}
      </TableBody>
    </Table>
  )
}

export default CustomTable
