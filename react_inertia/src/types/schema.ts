import { User } from "./index"

export interface IDateTime {
  created_at: string
  updated_at: string
}

export interface IUserCatalogueSave {
  name: string
  canonical: string
  description?: string | undefined
}

export interface IUserCatalogueGet extends IUserCatalogueSave, IDateTime {
  id: string
}

export interface IUserCatalogueList {
  id: string
  name: string
  description: string
  publish: number
  creator: User
  created_at: string
  updated_at: string
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
