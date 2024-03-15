import { DateTime } from 'luxon';

export const weekdayToDatetime = (weekday: number, time: string) => {
  const date = DateTime.fromISO(time).set({ weekday });
  return date.toFormat('yyyy-MM-dd HH:mm');
};

export const weekdayToDate = (weekday: number) => {
  const date = DateTime.local().set({ weekday });
  return date.toFormat('yyyy-MM-dd');
};

export const convertToDate = (weekday: string | number, startTime: string) => {
  return weekdayToDatetime(<number>weekday, startTime);
};
