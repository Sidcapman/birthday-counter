export interface Birthday {
  id: string;
  name: string;
  date: string;
  reminderType: ReminderType;
  repeatType: RepeatType;
  eventType: EventType;
  showPreference: ShowPreference;
  showAge: boolean;
  createdAt: string;
  updatedAt: string;
  daysUntilNext?: number;
  age?: number;
}

export enum ReminderType {
  NONE = 'NONE',
  SAME_DAY = 'SAME_DAY',
  ONE_DAY_BEFORE = 'ONE_DAY_BEFORE',
  ONE_WEEK_BEFORE = 'ONE_WEEK_BEFORE',
  CUSTOM = 'CUSTOM'
}

export enum RepeatType {
  NEVER = 'NEVER',
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  WEEKLY = 'WEEKLY'
}

export enum EventType {
  BIRTHDAY = 'BIRTHDAY',
  ANNIVERSARY = 'ANNIVERSARY',
  HOLIDAY = 'HOLIDAY',
  OTHER = 'OTHER'
}

export enum ShowPreference {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
  FRIENDS_ONLY = 'FRIENDS_ONLY'
}

export interface CreateBirthdayRequest {
  name: string;
  date: string;
  reminderType: ReminderType;
  repeatType: RepeatType;
  eventType: EventType;
  showPreference: ShowPreference;
  showAge: boolean;
}

export interface UpdateBirthdayRequest {
  name: string;
  date?: string;
  reminderType?: ReminderType;
  repeatType?: RepeatType;
  eventType?: EventType;
  showPreference?: ShowPreference;
  showAge?: boolean;
}

export interface BirthdayFormData {
  name: string;
  date: string;
  reminderType: ReminderType;
  repeatType: RepeatType;
  eventType: EventType;
  showPreference: ShowPreference;
  showAge: boolean;
}

export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  count?: number;
  error?: string;
  fieldErrors?: Array<{
    field: string;
    message: string;
    rejectedValue: string;
  }>;
}