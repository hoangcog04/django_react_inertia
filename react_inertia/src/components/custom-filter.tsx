"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ROUTES } from "@/constants"
import { IFilter } from "@/types"
import { Loader2, Search } from "lucide-react"
import { useRouter } from "next13-progressbar"
import { Control, Controller, useForm, UseFormSetValue } from "react-hook-form"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface FilterFormValues {
  keyword: string
  [key: string]: string
}

type FilterUnitProps = {
  filter: IFilter
  control: Control<FilterFormValues>
}
const FilterUnit = ({ filter, control }: FilterUnitProps) => {
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
            <Select defaultValue="0" disabled>
              <SelectTrigger
                className={`mr-2.5 w-[180px] cursor-pointer rounded-[5px] ${filter.className}`}
              >
                <SelectValue placeholder={filter.placeholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">
                  <Loader2 className="size-4 animate-spin" />
                </SelectItem>
              </SelectContent>
            </Select>
          </>
        ) : (
          <>
            <Select
              defaultValue={filter.defaultValue}
              value={field.value}
              onValueChange={field.onChange}
            >
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
}
export default function CustomFilter({ filters = [] }: CustomFilterProps) {
  const [isSearching, setIsSearching] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const { control, setValue, handleSubmit } = useForm<FilterFormValues>({
    defaultValues: {
      ...Object.fromEntries(filters.map((f) => [f.key, f.defaultValue])),
    },
  })

  useEffect(() => {
    const searchParamsMap = Object.fromEntries(searchParams.entries())
    filters.forEach((f) => {
      const value = searchParamsMap[f.key] || f.defaultValue || ""
      setValue(f.key, value)
    })
  }, [filters, searchParams, setValue])

  const onSubmit = async (data: FilterFormValues) => {
    setIsSearching(true)

    try {
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
      router.push(`${ROUTES.user_catalogue}${newUrl}`, { scroll: false })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      const mockApiResponse = {
        success: true,
        data: {
          filters: Object.fromEntries(params),
          results: [
            { id: 1, name: "Result 1" },
            { id: 2, name: "Result 2" },
            { id: 3, name: "Result 3" },
          ],
        },
      }
      console.log("✅ API Response:", mockApiResponse)
    } catch (error) {
      console.error("❌ Search error:", error)
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex">
        {filters.map((filter) => (
          <FilterUnit key={filter.key} filter={filter} control={control} />
        ))}

        <Button
          type="submit"
          className="flex items-center rounded-[5px] font-light hover:bg-[#0088ff]/80"
          disabled={isSearching}
        >
          {isSearching ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search />
          )}
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
