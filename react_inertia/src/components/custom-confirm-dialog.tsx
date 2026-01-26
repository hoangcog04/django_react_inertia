"use client"

import React from "react"
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

type CustomConfirmDialogProps = {
  onConfirm: () => void
  isLoading?: boolean
  open?: boolean
  setOpen?: (open: boolean) => void
  title?: string
  description?: string
}
export default function CustomConfirmDialog({
  onConfirm,
  isLoading = false,
  open = false,
  setOpen,
  title = "Xác nhận thao tác",
  description = "Hãy chắc chắn bạn muốn thực hiện hành động này",
}: CustomConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <Button onClick={onConfirm} disabled={isLoading}>
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
