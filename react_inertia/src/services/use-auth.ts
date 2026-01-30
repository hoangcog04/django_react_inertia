import { LS_KEYS } from "@/constants"
import storage from "@/utils/storage"
import { useMutation } from "@tanstack/react-query"

import { ILogin, ILoginResponse, IRefreshResp } from "@/types/schema"
import httpRequest from "@/lib/axios"

const login = (params: ILogin): Promise<ILoginResponse> => {
  return httpRequest.post("/token/login/", params)
}

const logout = (): Promise<void> => {
  return httpRequest.post("/token/logout/", {
    refresh: storage.get(LS_KEYS.REFRESH_TOKEN),
  })
}

const refresh = (): Promise<IRefreshResp> => {
  return httpRequest.post("/token/refresh/", {
    refresh: storage.get(LS_KEYS.REFRESH_TOKEN),
  })
}

export const authKeys = {
  key: "auth" as const,
  logout: () => [authKeys.key, "logout"] as const,
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (params: ILogin) => login(params),
    onSuccess: (data) => {
      storage.set(LS_KEYS.ACCESS_TOKEN, data.access)
      storage.set(LS_KEYS.REFRESH_TOKEN, data.refresh)
    },
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      storage.remove(LS_KEYS.ACCESS_TOKEN)
      storage.remove(LS_KEYS.REFRESH_TOKEN)
    },
  })
}

export const useRefresh = () => {
  return useMutation({
    mutationFn: () => refresh(),
    onSuccess: (data) => {
      storage.set(LS_KEYS.ACCESS_TOKEN, data.access)
      storage.set(LS_KEYS.REFRESH_TOKEN, data.refresh)
    },
  })
}
