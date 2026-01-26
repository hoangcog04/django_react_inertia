"use client"

import { useCallback, useMemo, useState } from "react"
import { AnyFn, PageConfig } from "@/types"

import useSwitch from "./use-switch"

type UseTableProps<T, M extends AnyFn> = {
  pageConfig: PageConfig<T>
  mustBeMemoMutateFnUsedBySwitch?: M
  records: T[]
}
/**
 * Hook for managing table state.
 *
 * @typeParam T - Shape of a single row in the table
 * @typeParam M - Mutation function type
 */
const useTable = <T extends { id: string }, M extends AnyFn>({
  pageConfig,
  mustBeMemoMutateFnUsedBySwitch,
  records,
}: UseTableProps<T, M>) => {
  const hasMustBeMemoMutateFnUsedBySwitch = !!mustBeMemoMutateFnUsedBySwitch
  const hasSwitches = !!pageConfig.switches

  if (hasMustBeMemoMutateFnUsedBySwitch !== hasSwitches) {
    throw new Error(
      `useTable must be used with a mustBeMemoizedMutateFnUsedBySwitch and a pageConfig.switches, or without them both`
    )
  }

  const { switches, handleSwitchChange } = useSwitch<T, M>({
    mustBeMemoOnMutate: mustBeMemoMutateFnUsedBySwitch as M,
    switchFields: pageConfig.switches!,
  })
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const isAllSelected = useMemo(
    () => records.length > 0 && records.length === selectedIds.length,
    [records, selectedIds]
  )

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(records.map((item) => item.id))
      } else {
        setSelectedIds([])
      }
    },
    [records]
  )

  const handleSelectOne = useCallback((id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id])
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id))
    }
  }, [])

  return {
    switches,
    selectedIds,
    isAllSelected,
    setSelectedIds,
    handleSwitchChange,
    handleSelectAll,
    handleSelectOne,
  }
}

export default useTable
