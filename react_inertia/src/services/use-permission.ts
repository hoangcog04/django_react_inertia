import { PageNumberPagingResponse, User } from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { IDateTime } from "@/types/common"
import httpRequest from "@/lib/axios"

// schemas
export interface PermissionBulkDeleteReq {
  ids: string[]
}

export interface IPermissionSave {
  name?: string
  canonical?: string
  description?: string
  publish?: number
}

export interface IPermissionGet extends IPermissionSave, IDateTime {
  id: string
}

export interface IPermissionList extends IDateTime {
  id: string
  name: string
  canonical: string
  description: string
  publish: number
  creator: User
}

export interface PermissionBulkUpdateReq {
  ids: string[]
  publish?: 1 | 2
  [key: string]: any
}

// services
const savePermission = (params: IPermissionSave): Promise<any> => {
  return httpRequest.post("/permission/save/", params)
}

const getPermission = (id: string): Promise<IPermissionGet> => {
  return httpRequest.get(`/permission/${id}/get/`)
}

const getPermissionList = (
  params?: string
): Promise<PageNumberPagingResponse<IPermissionList>> => {
  return httpRequest.get(`/permission/?${params}`)
}

const updatePermission = (
  id: string,
  params: IPermissionSave
): Promise<any> => {
  return httpRequest.put(`/permission/${id}/save/`, params)
}

const deletePermission = (id: string): Promise<any> => {
  return httpRequest.delete(`/permission/${id}/delete/`)
}

const bulkDeletePermission = (
  params: PermissionBulkDeleteReq
): Promise<any> => {
  return httpRequest.delete("/permission/bulk/", { data: params })
}

const bulkUpdatePermission = (
  params: PermissionBulkUpdateReq
): Promise<any> => {
  return httpRequest.put("/permission/bulk/", params)
}

// keys
export const permissionKeys = {
  key: "permission" as const,
  save: () => [permissionKeys.key, "save"] as const,
  update: (id: string) => [permissionKeys.key, id, "update"] as const,
  get: (id: string) => [permissionKeys.key, "get", id] as const,
  permission_list: (params?: string) => {
    if (params) return [permissionKeys.key, "permission_list", params] as const
    return [permissionKeys.key, "permission_list"] as const
  },
  permission_delete: (id: string) =>
    [permissionKeys.key, "permission_delete", id] as const,
}

// hooks
export const usePermission = () => {
  const queryClient = useQueryClient()

  const useSavePermission = () => {
    return useMutation({ mutationFn: savePermission })
  }

  const useGetPermission = (id: string, enabled: boolean = false) => {
    return useQuery({
      queryKey: permissionKeys.get(id),
      queryFn: () => getPermission(id),
      enabled,
    })
  }

  const useGetPermissionList = (params?: string) => {
    return useQuery({
      queryKey: permissionKeys.permission_list(params),
      queryFn: () => getPermissionList(params),
    })
  }

  const useDeletePermission = () => {
    return useMutation({
      mutationFn: (id: string) => deletePermission(id),
      onSuccess: () => {
        // always invalidate the permission_list query
        // no worry if we're still on the page or not
        queryClient.invalidateQueries({
          queryKey: permissionKeys.permission_list(),
        })
      },
    })
  }

  return {
    useSavePermission,
    useGetPermission,
    useGetPermissionList,
    useDeletePermission,
  }
}

export const useUpdatePermission = () => {
  return useMutation({
    mutationFn: (params: { id: string; data: IPermissionSave }) =>
      updatePermission(params.id, params.data),
  })
}

export const useBulkDeletePermission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: PermissionBulkDeleteReq) =>
      bulkDeletePermission(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: permissionKeys.permission_list(),
      })
    },
  })
}

export const useBulkUpdatePermission = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bulkUpdatePermission,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: permissionKeys.permission_list(),
      })
    },
  })
}
