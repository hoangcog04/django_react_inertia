import { User } from "./index"

export interface IDateTime {
  created_at: string
  updated_at: string
}

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

export interface ILogin {
  username: string
  password: string
}
export interface ILogout {
  refresh: string
}

export interface ILoginResponse {
  access: string
  refresh: string
}
export interface IRefreshResp {
  access: string
  refresh: string
}

export interface UserCatalogueBulkUpdateReq {
  ids: string[]
  publish?: 1 | 2
  [key: string]: any
}
