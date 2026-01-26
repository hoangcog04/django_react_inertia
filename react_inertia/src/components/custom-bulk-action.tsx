"use client"

import React, { useState } from "react"
import { sleep } from "@/utils/helpers"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import CustomConfirmDialog from "./custom-confirm-dialog"

export interface IBulkAction {
  label: string
  confirm?: boolean
  confirmTitle?: string
  confirmDescription?: string
  run: (ids: string[]) => Promise<void>
}
const defaultActions: IBulkAction[] = []

type CustomBulkActionProps = {
  selectedIds: string[]
  className?: string
  actions?: IBulkAction[]
  setSelectedIds: (ids: string[]) => void
}
export default function CustomBulkAction({
  selectedIds,
  className,
  actions,
  setSelectedIds,
}: CustomBulkActionProps) {
  const mergedActions = [...defaultActions, ...(actions ?? [])]

  const [open, setOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pendingAction, setPendingAction] = useState<IBulkAction | null>(null)

  const handleValueChange = async (index: string) => {
    const action = mergedActions[Number(index)]
    if (!action) return

    if (action.confirm) {
      setOpen(true)
      setPendingAction(action)
    } else {
      await action.run(selectedIds)
      setSelectedIds([])
    }
  }

  const handleConfirm = async () => {
    if (!pendingAction) return

    try {
      setIsProcessing(true)
      await pendingAction.run(selectedIds)
      setSelectedIds([])
    } finally {
      setIsProcessing(false)
      setOpen(false)
    }
  }

  return (
    <div className={`${className ? className : ""}`}>
      <Select onValueChange={handleValueChange}>
        <SelectTrigger
          className={`mr-[10px] w-[220px] cursor-pointer rounded-[5px] ${className}`}
        >
          <SelectValue placeholder="Chọn tác vụ" />
        </SelectTrigger>
        <SelectContent>
          {mergedActions.map((action, index) => (
            <SelectItem key={index} value={index.toString()}>
              {action.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {pendingAction && (
        <CustomConfirmDialog
          open={open}
          setOpen={setOpen}
          title={pendingAction.confirmTitle}
          description={pendingAction.confirmDescription}
          onConfirm={handleConfirm}
          isLoading={isProcessing}
        />
      )}
    </div>
  )
}
