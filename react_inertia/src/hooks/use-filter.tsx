import { useMemo } from "react"
import { chooseAll, keywordFilter } from "@/constants/filter"
import { PageConfig, User } from "@/types"

type UseFilterProps = {
  pageConfig: PageConfig
  users?: User[]
  statusFilters?: Map<string, boolean>
}
export const useFilter = ({
  pageConfig,
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
      ...(pageConfig.filters ?? []),
      {
        key: "user_id",
        placeholder: "Chọn người tạo",
        defaultValue: "0",
        options: [chooseAll("Tất cả người tạo"), ...userOptions],
        isLoading: statusFilters?.get("user_id") ?? false,
        type: "select" as const,
      },
      keywordFilter,
    ]
  }, [users, pageConfig, statusFilters])
}
