export interface SingletonService<Create, Patch, Entity extends object> {
  get(userId: string): Promise<Entity | undefined>
  create(userId: string, value: Create): Promise<Entity>
  patch(
    userId: string,
    value: (Create | Patch) & { revision: number },
  ): Promise<Entity>
}
