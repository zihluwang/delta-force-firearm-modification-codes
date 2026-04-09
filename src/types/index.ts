export type Direction = "ASC" | "DESC"

export type FirearmType =
  | "RIFLE"
  | "SUB_MACHINE_GUN"
  | "SHOTGUN"
  | "LIGHT_MACHINE_GUN"
  | "DESIGNATED_MARKSMAN_RIFLE"
  | "SNIPER_RIFLE"
  | "PISTOL"
  | "SPECIAL"

export interface Page<T> {
  items: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface Firearm {
  id: number
  name: string
  type: FirearmType
  level: string
  calibre: string
  fireRate: number
  armourDamage: number
  bodyDamage: number
  review: string
}

export interface Modification {
  id: number
  firearmId: number
  name: string
  code: string
  tags: string[]
  note: string
  author: string
  videoUrl: string
}

export interface PageQueryParams {
  page?: number
  size?: number
  sortBy?: string
  direction?: Direction
}
