"use client"

import React, { useEffect } from "react"
import { ReadonlyURLSearchParams } from "next/navigation"
import { IFilter } from "@/types"
import { Loader2, Search } from "lucide-react"
import { useRouter } from "next13-progressbar"
import { Control, Controller, useForm } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface FilterFormValues {
  keyword: string
  [key: string]: string
}

type FilterComponentProps = {
  filter: IFilter
  control: Control<FilterFormValues>
}
const FilterComponent = ({ filter, control }: FilterComponentProps) => {
  if (filter.type === "input") {
    return (
      <Controller
        name={filter.key}
        control={control}
        render={({ field }) => (
          <Input
            type="text"
            placeholder={filter.placeholder}
            className={`mr-2.5 w-[250px] rounded-[5px] text-[8px] ${filter.className}`}
            {...field}
          />
        )}
      />
    )
  }

  return (
    <Controller
      name={filter.key}
      control={control}
      render={({ field }) =>
        filter.isLoading ? (
          <>
            <Select defaultValue="loading" disabled>
              <SelectTrigger
                className={`mr-2.5 w-[180px] cursor-pointer rounded-[5px] ${filter.className}`}
              >
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="loading">
                  <Loader2 className="size-4 animate-spin" />
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        ) : (
          <>
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={`mr-2.5 w-[180px] cursor-pointer rounded-[5px] ${filter.className}`}
              >
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </>
        )
      }
    />
  )
}

type CustomFilterProps = {
  filters?: IFilter[]
  searchParams: ReadonlyURLSearchParams
  isLoading: boolean
  rootPath: string
}
export default function CustomFilter({
  filters = [],
  searchParams,
  isLoading,
  rootPath,
}: CustomFilterProps) {
  const router = useRouter()

  const getDefaultValues = () => {
    const values = {} as FilterFormValues
    filters.forEach((f) => {
      values[f.key] = searchParams.get(f.key) || f.defaultValue || ""
    })
    return values
  }

  const { control, setValue, handleSubmit } = useForm<FilterFormValues>({
    defaultValues: getDefaultValues(),
  })

  useEffect(() => {
    filters.forEach((f) => {
      setValue(f.key, searchParams.get(f.key) || f.defaultValue || "")
    })
  }, [filters, searchParams, setValue])

  const onSubmit = async (data: FilterFormValues) => {
    const params = new URLSearchParams()

    filters.forEach((filter) => {
      const value = data[filter.key]
      if (value && value !== "0") {
        params.append(filter.key, value)
      }
    })

    if (data.keyword?.trim()) {
      params.append("keyword", data.keyword.trim())
    }

    const queryString = params.toString()
    const newUrl = queryString ? `?${queryString}` : ""
    router.push(`${rootPath}${newUrl}`, { scroll: false })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex">
        {filters.map((filter) => (
          <FilterComponent key={filter.key} filter={filter} control={control} />
        ))}

        <Button
          type="submit"
          className="flex items-center rounded-[5px] font-light hover:bg-[#0088ff]/80"
          disabled={isLoading}
        >
          {isLoading ? <Spinner className="size-4 animate-spin" /> : <Search />}
          <span className="">Tìm kiếm</span>
        </Button>
      </div>
    </form>
  )
}

{
  /* {!!filters?.length && filters.map((filter, index) => ( */
}
{
  /* [].map => [], safe */
}
