"use client"

import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { ROUTES, TOAST_TEXT } from "@/constants"
import {
  IPermissionGet,
  IPermissionList,
  useGetPermissionList,
} from "@/services/use-permission"
import {
  IUserCatalogueSave,
  userCatalogueKeys,
  useUpdateUserCatalogue,
  useUserCatalogue,
} from "@/services/use-user-catalogue"
import { type FormPageConfig } from "@/types"
import { customSlugify } from "@/utils/helpers"
import { zodResolver } from "@hookform/resolvers/zod"
import { useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next13-progressbar"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "react-toastify"
import * as z from "zod"

import { FUserCatalogue } from "@/types/form/user-catalogue"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import CustomCard from "@/components/custom-card"
import CustomNotice from "@/components/custom-notice"

const items = [
  {
    value: "notifications",
    trigger: "Notification Settings",
    content:
      "Manage how you receive notifications. You can enable email alerts for updates or push notifications for mobile devices.",
  },
  {
    value: "privacy",
    trigger: "Privacy & Security",
    content:
      "Control your privacy settings and security preferences. Enable two-factor authentication, manage connected devices, review active sessions, and configure data sharing preferences. You can also download your data or delete your account.",
  },
  {
    value: "billing",
    trigger: "Billing & Subscription",
    content:
      "View your current plan, payment history, and upcoming invoices. Update your payment method, change your subscription tier, or cancel your subscription.",
  },
]

const userCatalogueSchema = z.object({
  name: z.string().min(1, { error: "Tên nhóm thành viên là bắt buộc" }),
  canonical: z
    .string()
    .min(1, { error: "Từ khóa nhóm thành viên là bắt buộc" }),
  description: z.string().optional(),
  // permissions: z.array(z.number()),
})
type TUserCatalogue = z.infer<typeof userCatalogueSchema>

type PermissionWithoutCreator = Omit<IPermissionList, "creator">

interface IPermissionModule {
  title: string
  permissions: PermissionWithoutCreator[]
}

interface IPermissionGroup {
  [key: string]: IPermissionModule
}

const getModuleTitle = (canonical: string) => {
  const name = canonical.split(":")[0]
  console.log({ name })
  const moduleTitle: Record<string, string> = {
    permission: "Quản lý quyền",
    user_catalogue: "Quản lý nhóm thành viên",
  }

  return moduleTitle[name]
}

const formPageConfig: FormPageConfig<TUserCatalogue> = {
  // schema: userCatalogueSchema,
  defaultValues: {
    name: "",
    canonical: "",
    description: "",
    // permissions: [],
  },
}

type SaveFormProps = {
  isEdit?: boolean
}
export default function SaveForm({ isEdit = false }: SaveFormProps) {
  const router = useRouter()
  const params = useParams()
  const id = isEdit ? (params.id as string) : null
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([])
  const [permissionCount, setPermissionCount] = useState<{
    selected: number
    total: number
  }>({
    selected: 0,
    total: 0,
  })

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
  const {
    data: permissionListData,
    isPending: isPermissionListPending,
    isFetching: isPermissionListFetching,
  } = useGetPermissionList()
  const permissions: PermissionWithoutCreator[] | undefined = useMemo(
    () => permissionListData?.results?.map(({ creator, ...rest }) => rest),
    [permissionListData?.results]
  )
  const permissionGroups: IPermissionGroup = useMemo<IPermissionGroup>(() => {
    if (!permissions) return {}
    return permissions.reduce(
      (acc: IPermissionGroup, p: PermissionWithoutCreator) => {
        const moduleKey = p.canonical.split(":")[0]
        if (!acc[moduleKey]) {
          acc[moduleKey] = {
            title: getModuleTitle(p.canonical),
            permissions: [],
          }
        }
        acc[moduleKey].permissions.push(p)
        return acc
      },
      {}
    )
  }, [permissions])

  const isModuleSelected = useCallback(
    (permissions: PermissionWithoutCreator[]) => {
      return permissions.every((permission) =>
        selectedPermissions.includes(Number(permission.id))
      )
    },
    [selectedPermissions]
  )

  useEffect(() => {
    setPermissionCount((prev) => ({
      ...prev,
      selected: selectedPermissions.length,
      total: permissions?.length || 0,
    }))
  }, [permissions?.length, selectedPermissions.length])

  useEffect(() => {
    if (isEdit && data) {
      form.reset({
        name: data.name || "",
        canonical: data.canonical || "",
        description: data.description || "",
        // permissions: data.permissions ?? [],
      })
    }
  }, [data, form, isEdit])

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setSelectedPermissions((prev) => [...prev, Number(permissionId)])
    } else {
      setSelectedPermissions((prev) =>
        prev.filter((id) => id !== Number(permissionId))
      )
    }
  }

  const handleSelectAllPermissions = (
    permissions: PermissionWithoutCreator[],
    checked: boolean
  ) => {
    const prevSelectedPermissions = [...selectedPermissions]
    const modulePermissionIds = permissions.map((permission) =>
      Number(permission.id)
    )
    let newPermissions
    if (checked) {
      newPermissions = [...prevSelectedPermissions, ...modulePermissionIds]
    } else {
      newPermissions = prevSelectedPermissions.filter(
        (id) => !modulePermissionIds.includes(id)
      )
    }
    setSelectedPermissions(newPermissions)
  }

  const handleSave = form.handleSubmit((formData: FUserCatalogue) => {
    const data: IUserCatalogueSave = {
      name: formData.name,
      canonical: formData.canonical,
      description: formData.description,
      permissions: selectedPermissions,
    }
    if (isEdit) {
      updateUserCatalogue(
        { paramId: id as string, data },
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
      saveUserCatalogue(data, {
        onSuccess: () => {
          toast.success(TOAST_TEXT.USER_CATALOGUE_SAVE_SUCCESS)
          form.reset()
        },
      })
    }
  })
  const handleSaveAndClose = form.handleSubmit((formData: FUserCatalogue) => {
    const data: IUserCatalogueSave = {
      name: formData.name,
      canonical: formData.canonical,
      description: formData.description,
      permissions: selectedPermissions,
    }
    if (isEdit) {
      updateUserCatalogue(
        { paramId: id as string, data },
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
      saveUserCatalogue(data, {
        onSuccess: () => {
          toast.success(TOAST_TEXT.USER_CATALOGUE_SAVE_AND_CLOSE_SUCCESS)
          router.push(ROUTES.user_catalogue)
        },
      })
    }
  })
  const handleSelectAllModulePermissions = () => {
    setSelectedPermissions(
      permissions?.map((permission) => Number(permission.id)) || []
    )
  }
  const handleUnSelectAllModulePermissions = () => {
    setSelectedPermissions([])
  }

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
                className="mb-5"
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
              <CustomCard
                title="Lựa chọn quyền của nhóm thành viên"
                description="Lựa chọn ít nhất 1 quyền cho nhóm thành viên bằng cách tích chọn các ô lựa chọn dưới dây"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div className="text-sm text-blue-600">
                    Đã chọn: <span>{permissionCount.selected}</span>/
                    <span>{permissionCount.total}</span> quyền
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-gray-600"
                      onClick={handleUnSelectAllModulePermissions}
                    >
                      Bỏ chọn tất cả
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="text-blue-600"
                      onClick={handleSelectAllModulePermissions}
                    >
                      Chọn tất cả
                    </Button>
                  </div>
                </div>
                <ScrollArea className="h-[500px] pr-[15px]">
                  <Accordion
                    type="multiple"
                    className="w-full"
                    defaultValue={["item-1"]}
                  >
                    {Object.entries(permissionGroups).map(
                      ([key, permissionModule]) => (
                        <AccordionItem
                          value={key}
                          className="mb-[15px] rounded-tl rounded-tr border data-[state=open]:pb-[15px]"
                          key={key}
                        >
                          <div className="relative flex w-full">
                            <div className="absolute left-4 top-1/2 z-20 -translate-y-1/2">
                              <Checkbox
                                id={`moduleKey-${key}`}
                                className="size-4 rounded-sm"
                                onCheckedChange={(checked) => {
                                  handleSelectAllPermissions(
                                    permissionModule.permissions,
                                    checked === true
                                  )
                                }}
                                checked={isModuleSelected(
                                  permissionModule.permissions
                                )}
                              />
                            </div>
                            <AccordionTrigger className="w-full items-center py-3 pl-12 pr-4 hover:bg-slate-50 hover:no-underline">
                              <Label
                                htmlFor="parent-check"
                                className="cursor-pointer font-normal text-blue-600"
                              >
                                {permissionModule.title}
                              </Label>
                            </AccordionTrigger>
                          </div>

                          <AccordionContent className="flex flex-col gap-4 text-balance px-4 py-2">
                            <div className="grid grid-cols-3 pl-8">
                              {permissionModule.permissions.map(
                                (permission) => (
                                  <div
                                    className="flex items-center space-x-2"
                                    key={permission.id}
                                  >
                                    <Checkbox
                                      id={`moduleKey-${permission.id}`}
                                      className="size-4 rounded-sm"
                                      onCheckedChange={(checked) =>
                                        handlePermissionChange(
                                          permission.id,
                                          checked === true
                                        )
                                      }
                                      name="permissions"
                                      checked={selectedPermissions.includes(
                                        Number(permission.id)
                                      )}
                                    />
                                    <Label
                                      htmlFor={`moduleKey-${permission.id}`}
                                      className="cursor-pointer text-sm font-normal"
                                    >
                                      {permission.name}
                                    </Label>
                                  </div>
                                )
                              )}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )
                    )}
                  </Accordion>
                </ScrollArea>
              </CustomCard>
            </fieldset>
          </form>
        </Form>
      </div>
    </div>
  )
}
