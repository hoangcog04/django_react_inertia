import { HttpStatusCode } from "axios"

export interface ErrorResponse {
  message: string[]
  requestId: string
  statusCode: HttpStatusCode
  extra: Record<string, any>
}

export interface IDateTime {
  created_at: string
  updated_at: string
}
