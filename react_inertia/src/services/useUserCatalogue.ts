// key, tanstack, service, api, type
import { TOAST_TEXT } from "@/constants"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "react-toastify"

import { IUserCatalogueGet, IUserCatalogueSave } from "@/types/schema"
import httpRequest from "@/lib/axios"

const saveUserCatalogue = (params: IUserCatalogueSave): Promise<any> => {
  return httpRequest.post("/user_catalogue/save/", params)
}

const getUserCatalogue = (id: string): Promise<IUserCatalogueGet> => {
  return httpRequest.get(`/user_catalogue/${id}/get/`)
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

  return {
    useSaveUserCatalogue,
    useGetUserCatalogue,
    useUpdateUserCatalogue,
  }
}
