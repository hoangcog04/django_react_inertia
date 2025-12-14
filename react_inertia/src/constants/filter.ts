import { IFilter, ISelectOptionItem } from "@/types"

export const publish: ISelectOptionItem[] = [
  {
    label: "Không hoạt động",
    value: "1",
  },
  {
    label: "Hoạt động",
    value: "2",
  },
]

// export const chooseAll: ISelectOptionItem = {
//   label: "Chọn tất cả",
//   value: "0",
// }
export const chooseAll = (
  label: string = "Chọn tất cả"
): ISelectOptionItem => ({
  label,
  value: "0",
})

export const filter: IFilter[] = [
  {
    key: "perpage",
    placeholder: "Chọn số bản ghi",
    defaultValue: "20",
    options: ["20", "30", "40", "50", "60", "80", "100"].map((item) => ({
      label: `${item} bản ghi`,
      value: item,
    })),
    type: "select",
  },
  {
    key: "publish",
    placeholder: "Chọn trạng thái",
    defaultValue: "0",
    options: [chooseAll("Tất cả trạng thái"), ...publish],
    type: "select",
  },
]
export const keywordFilter: IFilter = {
  key: "keyword",
  placeholder: "Từ khóa tìm kiếm",
  defaultValue: "",
  options: [],
  type: "input" as const,
}
