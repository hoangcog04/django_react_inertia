import { LS_KEYS } from "@/constants"
import { PaginationParams, PagingResponse, User } from "@/types"
import storage from "@/utils/storage"
import { useMutation, useQuery } from "@tanstack/react-query"

import { ILogin, ILoginResponse } from "@/types/schema"
import httpRequest from "@/lib/axios"

const login = (params: ILogin): Promise<ILoginResponse> => {
  return httpRequest.post("/auth-token/", params)
}

export const authKeys = {
  key: "auth" as const,
  login: () => [authKeys.key, "login"] as const,
}

export const useAuth = () => {
  const useLogin = () => {
    return useMutation({
      mutationFn: (params: ILogin) => login(params),
      onSuccess: (data) => {
        storage.set(LS_KEYS.TOKEN, data.token)
      },
    })
  }

  return {
    useLogin,
  }
}
