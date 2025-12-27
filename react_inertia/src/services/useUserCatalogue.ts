// key, tanstack, service, api, type
import { PaginationParams, PagingResponse, User } from "@/types"
import { useMutation, useQuery } from "@tanstack/react-query"

import {
  IUserCatalogueGet,
  IUserCatalogueList,
  IUserCatalogueSave,
} from "@/types/schema"
import httpRequest from "@/lib/axios"

const saveUserCatalogue = (params: IUserCatalogueSave): Promise<any> => {
  return httpRequest.post("/user_catalogue/save/", params)
}

const getUserCatalogue = (id: string): Promise<IUserCatalogueGet> => {
  return httpRequest.get(`/user_catalogue/${id}/get/`)
}

const getUserList = (
  params?: PaginationParams
): Promise<PagingResponse<User>> => {
  return httpRequest.get(`/users/`, { params })
}

const getUserCatalogueList = (
  params?: string
): Promise<PagingResponse<IUserCatalogueList>> => {
  return httpRequest.get(`/user_catalogue/?${params}`)
}

const updateUserCatalogue = (
  id: string,
  params: IUserCatalogueSave
): Promise<any> => {
  return httpRequest.put(`/user_catalogue/${id}/save/`, params)
}

export const userCatalogueKeys = {
  key: "userCatalogue" as const,
  save: () => [userCatalogueKeys.key, "save"] as const,
  update: (id: string) => [userCatalogueKeys.key, id, "update"] as const,
  get: (id: string) => [userCatalogueKeys.key, "get", id] as const,
  user_list: (params?: PaginationParams) =>
    [userCatalogueKeys.key, "user_list", params] as const,
  user_catalogue_list: (params?: string) =>
    [userCatalogueKeys.key, "user_catalogue_list", params] as const,
}

export const useUserCatalogue = () => {
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

  const useUpdateUserCatalogue = () => {
    return useMutation({
      mutationFn: (params: { id: string; data: IUserCatalogueSave }) =>
        updateUserCatalogue(params.id, params.data),
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

  return {
    useSaveUserCatalogue,
    useGetUserCatalogue,
    useUpdateUserCatalogue,
    useGetUserList,
    useGetUserCatalogueList,
  }
}
