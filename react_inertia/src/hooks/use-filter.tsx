import { useMemo } from "react"
import { chooseAll, keywordFilter } from "@/constants/filter"
import { IFilter, PageConfig, User } from "@/types"

type UseFilterProps = {
  pageFilters?: IFilter[]
  users?: User[]
  statusFilters?: Map<string, boolean>
}
export const useFilter = ({
  pageFilters,
  users,
  statusFilters,
}: UseFilterProps) => {
  return useMemo(() => {
    const userOptions =
      users?.map((user) => ({
        label: user.name,
        value: user.id.toString(),
      })) ?? []

    return [
      ...(pageFilters ?? []),
      {
        key: "creator_id",
        placeholder: "Chọn người tạo",
        defaultValue: "0",
        options: [chooseAll("Tất cả người tạo"), ...userOptions],
        isLoading: statusFilters?.get("creator_id") ?? false,
        type: "select" as const,
      },
      keywordFilter,
    ]
  }, [users, pageFilters, statusFilters])
}
