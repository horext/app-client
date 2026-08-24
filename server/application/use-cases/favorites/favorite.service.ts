export interface FavoriteEntity {
  toSnapshot(): object
}

export interface FavoriteService<Entity extends FavoriteEntity> {
  get(userId: string, id: string): Promise<Entity | undefined>
  scheduleExists(userId: string, id: string): Promise<boolean>
  create(userId: string, id: string): Promise<Entity>
}
