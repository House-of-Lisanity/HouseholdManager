export interface GymSession {
  day: string;
  startTime: string;
  endTime: string;
  gymType: string;
}

export interface OneOffItem {
  id: string;
  type: 'meeting' | 'appointment' | 'event';
  description: string;
  day: string;
  startTime: string;
  endTime: string;
}

export interface RecurringItem {
  id: string;
  type: 'meeting' | 'chore';
  description: string;
  day: string;
  startTime?: string;
  endTime?: string;
  includeThisWeek: boolean;
}

export interface BufferRule {
  activityType: 'gym' | 'event' | 'appointment';
  minutesBefore: number;
  minutesAfter: number;
}

export interface Location {
  name: string;
  address: string;
  driveTimeMinutes: number;
}
