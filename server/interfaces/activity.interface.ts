import type { IBaseEvent as IBaseActivity } from '~/interfaces/event'

export { IBaseActivity }

export interface IActivity extends IBaseActivity {
  userId: string
  createdAt: Date
  updatedAt: Date
}