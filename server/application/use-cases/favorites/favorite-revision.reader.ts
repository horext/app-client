export interface FavoriteRevisionReader {
  get(userId: string, id: string): Promise<number | undefined>
}
