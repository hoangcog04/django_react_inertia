import slugify from "slugify"

export function isSameUrl(url1: string, url2: string) {
  return url1 === url2
}

export function resolveUrl(url: string): string {
  return url
}

export function customSlugify(value: string, locale: string = "vi"): string {
  return slugify(value, { locale })
}
