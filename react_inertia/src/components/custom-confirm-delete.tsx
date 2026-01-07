"use client"

import React, { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Button } from "./ui/button"
import { Spinner } from "./ui/spinner"

type CustomConfirmDeleteProps = {
  children?: React.ReactNode
  onConfirm: () => void
  onCancel?: () => void
  isLoading?: boolean
  open?: boolean
  setOpen?: (open: boolean) => void
}
export default function CustomConfirmDelete({
  children,
  onConfirm,
  onCancel,
  isLoading = false,
  open = false,
  setOpen,
}: CustomConfirmDeleteProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button
            type="button"
            className="size-7 cursor-pointer rounded-[5px] bg-[#ed5565] p-0"
          >
            <Trash2 />
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Bạn có chắc chắn muốn xóa bản ghi này?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Lưu ý: Hành động này là không thể đảo ngược, hãy chắc chắn bạn muốn
            thực hiện hành động này
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Hủy</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="size-4 animate-spin" />
            ) : (
              "Xác nhận"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
