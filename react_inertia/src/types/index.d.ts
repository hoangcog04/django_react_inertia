import { InertiaLinkProps } from "@inertiajs/react"
import { LucideIcon } from "lucide-react"
import { z } from "zod"

export interface Auth {
  user: User
}

export interface BreadcrumbItem {
  title: string
  href: string
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export interface NavItem {
  title: string
  // href: NonNullable<InertiaLinkProps["href"]>
  href: string
  icon?: LucideIcon | null
  isActive?: boolean
  items?: SubNavItem[]
}
export interface SubNavItem {
  title: string
  url: string
}

export interface SharedData {
  name: string
  quote: { message: string; author: string }
  auth: Auth
  sidebarOpen: boolean
  [key: string]: unknown
}

export interface PaginationParams {
  limit?: number
  offset?: number
}
export interface PagingResponse<T> {
  limit: number
  offset: number
  count: number
  next: string
  previous: string
  results: T[]
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  created_at: string
  updated_at: string
  [key: string]: unknown
}

export interface PageConfig {
  heading: string
  breadcrumbs?: BreadcrumbItem[]
  cardHeading?: string
  cardDescription?: string
  filters?: IFilter[]
}
export interface FormPageConfig<TFormValues> {
  // schema: z.ZodSchema<TFormValues>
  defaultValues: TFormValues
}

export interface ISelectOptionItem {
  label: string
  value: string
}

export interface IFilter {
  key: string
  placeholder: string
  defaultValue?: string
  options: ISelectOptionItem[]
  isLoading?: boolean
  className?: string
  type: "select" | "input"
}
