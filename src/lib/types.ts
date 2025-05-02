export interface Folder {
  id: string
  name: string
  userId: string
  parentId: string | null
  createdAt: string
  starred: boolean
}

export interface File {
  id: string
  name: string
  size: number
  type: string
  folderId: string | null
  userId: string
  blobUrl: string
  createdAt: string
  starred: boolean
}

export interface User {
  id: string
  name: string
  email: string
  image?: string
}

export interface RecentItem {
  id: string
  userId: string
  itemId: string
  type: "file" | "folder"
  accessedAt: string
}

export interface UserStorage {
  userId: string
  usedBytes: number
  totalBytes: number
}
