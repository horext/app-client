export class EventNotification {
    method: 'popup' | 'email'
    minutes: number
    constructor(minutes: number = 15, method: 'popup' | 'email' = 'popup') {
      this.method = method
      this.minutes = minutes
    }
  }