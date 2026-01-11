"use client"

import React, { useEffect, useMemo } from "react"
import { useParams } from "next/navigation"
import { ROUTES, TOAST_TEXT } from "@/constants"
import {
  userCatalogueKeys,
  useUpdateUserCatalogue,
  useUserCatalogue,
} from "@/services/useUserCatalogue"
import { type FormPageConfig } from "@/types"
import { customSlugify } from "@/utils/helpers"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { Loader2 } from "lucide-react"
import { useRouter } from "next13-progressbar"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "react-toastify"
import * as z from "zod"

import { IUserCatalogueSave } from "@/types/schema"
import axios from "@/lib/axios"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import CustomCard from "@/components/custom-card"
import CustomNotice from "@/components/custom-notice"

const userCatalogueSchema = z.object({
  name: z.string().min(1, { error: "Tên nhóm thành viên là bắt buộc" }),
  canonical: z
    .string()
    .min(1, { error: "Từ khóa nhóm thành viên là bắt buộc" }),
  description: z.string().optional(),
})
type TUserCatalogue = z.infer<typeof userCatalogueSchema>

const formPageConfig: FormPageConfig<TUserCatalogue> = {
  // schema: userCatalogueSchema,
  defaultValues: {
    name: "",
    canonical: "",
    description: "",
  },
}

type SaveFormProps = {
  isEdit?: boolean
}
export default function SaveForm({ isEdit = false }: SaveFormProps) {
  const router = useRouter()

  const params = useParams()
  const id = isEdit ? (params.id as string) : null

  const form = useForm<TUserCatalogue>({
    resolver: zodResolver(userCatalogueSchema),
    defaultValues: formPageConfig.defaultValues,
  })
  const canonical = useWatch({ control: form.control, name: "canonical" })
  const formattedCanonical = useMemo(
    () => customSlugify(canonical),
    [canonical]
  )

  const queryClient = useQueryClient()
  const { useSaveUserCatalogue, useGetUserCatalogue } = useUserCatalogue()
  const { mutate: saveUserCatalogue, isPending: isSaveUserCataloguePending } =
    useSaveUserCatalogue()
  const {
    mutate: updateUserCatalogue,
    isPending: isUpdateUserCataloguePending,
  } = useUpdateUserCatalogue()
  const { data, isLoading: isGetUserCatalogueLoading } = useGetUserCatalogue(
    id as string,
    isEdit && !!id
  )

  useEffect(() => {
    if (isEdit && data) {
      form.reset({
        name: data.name || "",
        canonical: data.canonical || "",
        description: data.description || "",
      })
    }
  }, [data, form, isEdit])

  const handleSave = form.handleSubmit((d: IUserCatalogueSave) => {
    if (isEdit) {
      updateUserCatalogue(
        { id: id as string, data: d },
        {
          onSuccess: () => {
            toast.success(TOAST_TEXT.USER_CATALOGUE_SAVE_SUCCESS)
            queryClient.invalidateQueries({
              queryKey: userCatalogueKeys.get(id as string),
            })
          },
        }
      )
    } else {
      saveUserCatalogue(d, {
        onSuccess: () => {
          toast.success(TOAST_TEXT.USER_CATALOGUE_SAVE_SUCCESS)
          form.reset()
        },
      })
    }
  })
  const handleSaveAndClose = form.handleSubmit((d: IUserCatalogueSave) => {
    if (isEdit) {
      updateUserCatalogue(
        { id: id as string, data: d },
        {
          onSuccess: () => {
            toast.success(TOAST_TEXT.USER_CATALOGUE_SAVE_SUCCESS)
            queryClient.invalidateQueries({
              queryKey: userCatalogueKeys.get(id as string),
            })
            router.push(ROUTES.user_catalogue)
          },
        }
      )
    } else {
      saveUserCatalogue(d, {
        onSuccess: () => {
          toast.success(TOAST_TEXT.USER_CATALOGUE_SAVE_AND_CLOSE_SUCCESS)
          router.push(ROUTES.user_catalogue)
        },
      })
    }
  })

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-5">
        <CustomNotice />
      </div>
      <div className="relative col-span-7">
        <Form {...form}>
          <form>
            <fieldset disabled={isGetUserCatalogueLoading}>
              <CustomCard
                title="Thông tin nhóm thành viên"
                description="Nhập thông tin nhóm thành viên"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="name">
                            Tên nhóm thành viên
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="name"
                              type="text"
                              name="name"
                              tabIndex={1}
                              placeholder="Nhập tên nhóm thành viên"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="col-span-1">
                    <FormField
                      control={form.control}
                      name="canonical"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="canonical">
                            Từ khóa nhóm thành viên
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              id="canonical"
                              type="text"
                              name="canonical"
                              tabIndex={2}
                              placeholder="Nhập từ khóa nhóm thành viên"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Label htmlFor="formattedCanonical">Từ khóa đã format</Label>
                  <Input
                    id="formattedCanonical"
                    name="formattedCanonical"
                    tabIndex={4}
                    type="text"
                    disabled
                    value={formattedCanonical}
                    placeholder="Từ khóa đã format"
                    className="!opacity-100"
                  />
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description">Mô tả ngắn</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          id="description"
                          name="description"
                          tabIndex={3}
                          className="h-32"
                          placeholder="Nhập mô tả ngắn"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-10">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      className="cursor-pointer rounded-[5px] font-light"
                      disabled={
                        isSaveUserCataloguePending ||
                        isUpdateUserCataloguePending
                      }
                      onClick={handleSave}
                    >
                      Lưu lại
                    </Button>
                    <Button
                      type="button"
                      className="cursor-pointer rounded-[5px] bg-[#1a7bb9] font-light"
                      disabled={
                        isSaveUserCataloguePending ||
                        isUpdateUserCataloguePending
                      }
                      onClick={handleSaveAndClose}
                    >
                      Lưu lại và đóng
                    </Button>
                  </div>
                </div>
              </CustomCard>
            </fieldset>
          </form>
        </Form>
      </div>
    </div>
  )
}
