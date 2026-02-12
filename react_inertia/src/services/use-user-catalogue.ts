import {
  LimitOffsetPagingResponse,
  PageNumberPagingResponse,
  PaginationParams,
  User,
} from "@/types"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { IDateTime } from "@/types/common"
import httpRequest from "@/lib/axios"

// schemas
export interface UserCatalogueBulkDeleteReq {
  ids: string[]
}

export interface IUserCatalogueSave {
  name?: string
  canonical?: string
  description?: string
  publish?: number
}

export interface IUserCatalogueGet extends IUserCatalogueSave, IDateTime {
  id: string
}

export interface IUserCatalogueList extends IDateTime {
  id: string
  name: string
  canonical: string
  description: string
  publish: number
  creator: User
}

export interface UserCatalogueBulkUpdateReq {
  ids: string[]
  publish?: 1 | 2
  [key: string]: any
}

// services
const saveUserCatalogue = (params: IUserCatalogueSave): Promise<any> => {
  return httpRequest.post("/user_catalogue/save/", params)
}

const getUserCatalogue = (id: string): Promise<IUserCatalogueGet> => {
  return httpRequest.get(`/user_catalogue/${id}/get/`)
}

const getUserList = (
  params?: PaginationParams
): Promise<LimitOffsetPagingResponse<User>> => {
  return httpRequest.get(`/users/`, { params })
}

const getUserCatalogueList = (
  params?: string
): Promise<PageNumberPagingResponse<IUserCatalogueList>> => {
  return httpRequest.get(`/user_catalogue/?${params}`)
}

const updateUserCatalogue = (
  id: string,
  params: IUserCatalogueSave
): Promise<any> => {
  return httpRequest.put(`/user_catalogue/${id}/save/`, params)
}

const deleteUserCatalogue = (id: string): Promise<any> => {
  return httpRequest.delete(`/user_catalogue/${id}/delete/`)
}

const bulkDeleteUserCatalogue = (
  params: UserCatalogueBulkDeleteReq
): Promise<any> => {
  return httpRequest.delete("/user_catalogue/bulk/", { data: params })
}

const bulkUpdateUserCatalogue = (
  params: UserCatalogueBulkUpdateReq
): Promise<any> => {
  return httpRequest.put("/user_catalogue/bulk/", params)
}

// keys
export const userCatalogueKeys = {
  key: "userCatalogue" as const,
  save: () => [userCatalogueKeys.key, "save"] as const,
  update: (id: string) => [userCatalogueKeys.key, id, "update"] as const,
  get: (id: string) => [userCatalogueKeys.key, "get", id] as const,
  user_list: (params?: PaginationParams) =>
    [userCatalogueKeys.key, "user_list", params] as const,
  user_catalogue_list: (params?: string) => {
    if (params)
      return [userCatalogueKeys.key, "user_catalogue_list", params] as const
    return [userCatalogueKeys.key, "user_catalogue_list"] as const
  },
  user_catalogue_delete: (id: string) =>
    [userCatalogueKeys.key, "user_catalogue_delete", id] as const,
}

// hooks
export const useUserCatalogue = () => {
  const queryClient = useQueryClient()

  const useSaveUserCatalogue = () => {
    return useMutation({ mutationFn: saveUserCatalogue })
  }

  const useGetUserCatalogue = (id: string, enabled: boolean = false) => {
    return useQuery({
      queryKey: userCatalogueKeys.get(id),
      queryFn: () => getUserCatalogue(id),
      enabled,
    })
  }

  const useGetUserList = (params?: PaginationParams) => {
    return useQuery({
      queryKey: userCatalogueKeys.user_list(params),
      queryFn: () => getUserList(params),
    })
  }

  const useGetUserCatalogueList = (params?: string) => {
    return useQuery({
      queryKey: userCatalogueKeys.user_catalogue_list(params),
      queryFn: () => getUserCatalogueList(params),
    })
  }

  const useDeleteUserCatalogue = () => {
    return useMutation({
      mutationFn: (id: string) => deleteUserCatalogue(id),
      onSuccess: () => {
        // always invalidate the user_catalogue_list query
        // no worry if we're still on the page or not
        queryClient.invalidateQueries({
          queryKey: userCatalogueKeys.user_catalogue_list(),
        })
      },
    })
  }

  return {
    useSaveUserCatalogue,
    useGetUserCatalogue,
    useGetUserList,
    useGetUserCatalogueList,
    useDeleteUserCatalogue,
  }
}

export const useUpdateUserCatalogue = () => {
  return useMutation({
    mutationFn: (params: { id: string; data: IUserCatalogueSave }) =>
      updateUserCatalogue(params.id, params.data),
  })
}

export const useBulkDeleteUserCatalogue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: UserCatalogueBulkDeleteReq) =>
      bulkDeleteUserCatalogue(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userCatalogueKeys.user_catalogue_list(),
      })
    },
  })
}

export const useBulkUpdateUserCatalogue = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: bulkUpdateUserCatalogue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: userCatalogueKeys.user_catalogue_list(),
      })
    },
  })
}
