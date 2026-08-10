export interface IEntityMetadata {
  createdAt: string
  updatedAt: string
  createdBy: string
  updatedBy: string
}

export type DomainSnapshot<T> = Omit<T, keyof IEntityMetadata>
