export interface ResourceRevisionReader {
  get(userId: string, id: string): Promise<number | undefined>
}
