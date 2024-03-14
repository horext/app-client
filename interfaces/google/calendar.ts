export interface IGoogleCalendarListPayload {
    kind: string;
    etag: string;
    nextSyncToken: string;
    items: IGoogleCalendarItem[];
  }
  
  export interface IGoogleCalendarItem {
    kind: string;
    etag: string;
    id: string;
    summary: string;
    description?: string;
    timeZone: string;
    summaryOverride?: string;
    colorId: string;
    backgroundColor: string;
    foregroundColor: string;
    selected: boolean;
    accessRole: string;
    defaultReminders: Reminder[];
    conferenceProperties: ConferenceProperties;
    notificationSettings?: NotificationSettings;
    primary?: boolean;
  }
  
  export interface Reminder {
    method: string;
    minutes: number;
  }
  
  export interface ConferenceProperties {
    allowedConferenceSolutionTypes: string[];
  }
  
  export interface NotificationSettings {
    notifications: Notification[];
  }
  
  interface Notification {
    type: string;
    method: string;
  }