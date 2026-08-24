export interface SingletonRevisionReader {
  get(userId: string): Promise<number | undefined>
}
