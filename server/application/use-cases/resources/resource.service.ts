export interface ResourceEntity {
  readonly id: string
  toSnapshot(): object
}

export interface ResourceService<Create, Patch, Entity extends ResourceEntity> {
  get(userId: string, id: string): Promise<Entity | undefined>
  create(userId: string, value: Create, id?: string): Promise<Entity>
  patch(
    userId: string,
    id: string,
    value: (Create | Patch) & { revision: number },
  ): Promise<Entity>
  delete(userId: string, id: string, revision: number): Promise<void>
}
