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
