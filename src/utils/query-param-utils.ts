import { PageQueryParams } from "@/types"

export function asUrlSearchParam(pageQueryParams?: PageQueryParams) {
  const urlSearchParams = new URLSearchParams()

  if (pageQueryParams?.page) {
    urlSearchParams.append("page", "" + pageQueryParams.page)
  }

  if (pageQueryParams?.size) {
    urlSearchParams.append("size", "" + pageQueryParams.size)
  }

  if (pageQueryParams?.sortBy) {
    urlSearchParams.append("sortBy", pageQueryParams.sortBy)
  }

  if (pageQueryParams?.direction) {
    urlSearchParams.append("direction", pageQueryParams.direction)
  }

  return urlSearchParams
}