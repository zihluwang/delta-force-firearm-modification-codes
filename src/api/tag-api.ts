import { WebClient } from "@/shared/web-client"

export async function getTags(firearmId?: number): Promise<string[]> {
  let uri = "/tags"

  const urlSearchParam = new URLSearchParams()

  if (firearmId) {
    urlSearchParam.append("firearmId", "" + firearmId)
  }

  if (urlSearchParam.size > 0) {
    uri = uri.concat("?", urlSearchParam.toString())
  }

  const { data } = await WebClient.get<string[]>(uri)
  return data
}