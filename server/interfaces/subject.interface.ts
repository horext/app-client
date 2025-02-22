import type { ISubject as IBaseSubject } from '~/interfaces/subject'

export interface ISubject extends IBaseSubject {
  userId: string
  createdAt: Date
  updatedAt: Date
}
