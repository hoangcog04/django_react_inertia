"use client"

import { useCallback, useState } from "react"
import { AnyFn, type PageConfig } from "@/types"

export type SwitchState<F extends string> = Record<
  string | number,
  {
    values: Partial<Record<F, string>>
    loading: boolean
  }
>

type UseSwitchProps<T, M extends AnyFn> = {
  mustBeMemoOnMutate: M
  switchFields: NonNullable<PageConfig<T>["switches"]>
}
const useSwitch = <T, M extends AnyFn>({
  mustBeMemoOnMutate,
  switchFields,
}: UseSwitchProps<T, M>) => {
  type SwitchField = (typeof switchFields)[number]

  const [switches, setSwitches] = useState<SwitchState<SwitchField>>({})

  const handleSwitchChange = useCallback(
    (id: string, field: SwitchField, currentValue: string | number) => {
      const newValue = currentValue === 2 ? 1 : 2
      setSwitches((prev) => ({
        ...prev,
        [id]: {
          values: { ...prev[id]?.values, [field]: newValue },
          loading: true,
        },
      }))
      mustBeMemoOnMutate(
        { id, data: { [field]: newValue } },
        {
          onError: () => {
            setSwitches((prev) => ({
              ...prev,
              [id]: {
                values: { ...prev[id]?.values, [field]: currentValue },
                loading: false,
              },
            }))
          },
          onSuccess: () => {
            setSwitches((prev) => ({
              ...prev,
              [id]: {
                values: { ...prev[id]?.values },
                loading: false,
              },
            }))
          },
        }
      )
    },
    [mustBeMemoOnMutate]
  )

  return { switches, handleSwitchChange }
}

export default useSwitch

// example
// const example: SwitchState<"publish"> = {
//   1: {
//     publish: "1",
//   },
//   2: {
//     publish: "2",
//   },
// }
