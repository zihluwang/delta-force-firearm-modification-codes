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

export interface ModificationRequest extends Omit<Modification, "id"> {}
