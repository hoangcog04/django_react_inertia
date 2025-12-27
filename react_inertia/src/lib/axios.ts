import { LS_KEYS } from "@/constants"
import axios, { AxiosError, AxiosResponse } from "axios"
import { toast } from "react-toastify"

import { ErrorResponse } from "@/types/common"

const FLASH_FROM_SERVER_TITLE = "Thông báo từ server"

const httpRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "content-type": "application/json",
  },
})

httpRequest.interceptors.request.use((config) => {
  // const token = localStorage.getItem(LS_KEYS.REFRESH_TOKEN)
  const token = localStorage.getItem(LS_KEYS.TOKEN)
  if (token) {
    // config.headers.Authorization = `Bearer ${token}`
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

httpRequest.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data) {
      if (response.data.flash) {
        const flash = response.data.flash
        if (flash.success)
          toast.success(FLASH_FROM_SERVER_TITLE + ": " + flash.success)
        if (flash.info) toast.info(FLASH_FROM_SERVER_TITLE + ": " + flash.info)
        if (flash.warning)
          toast.warning(FLASH_FROM_SERVER_TITLE + ": " + flash.warning)
        if (flash.error)
          toast.error(FLASH_FROM_SERVER_TITLE + ": " + flash.error)
      }
      return response.data
    }
  },

  (error: AxiosError<ErrorResponse>) => {
    const data = error.response?.data
    const status = error.response?.status

    if (status === 401) {
      localStorage.removeItem(LS_KEYS.REFRESH_TOKEN)
      localStorage.removeItem(LS_KEYS.ACCESS_TOKEN)

      return Promise.reject(error.response?.data)
    }

    if (status === 400) {
      if (data?.message) {
        const toastTitle = data.message
      }

      if (data?.extra?.fields) {
        const fields = data.extra.fields
        const formatted = []
        for (const [field, fieldMessages] of Object.entries(fields)) {
          if (Array.isArray(fieldMessages)) {
            const fieldMessagesString = fieldMessages.join(", ")
            formatted.push(`${field}: ${fieldMessagesString}`)
          }
        }
        const toastText = formatted.join("\n")

        toast.error(toastText)
      }
    }

    return Promise.reject(error)
  }
)

export default httpRequest
