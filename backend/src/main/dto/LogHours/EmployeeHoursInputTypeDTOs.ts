export interface EmployeeHoursInputTypeCreationDTO {
  email: string;
  automatic: boolean;
  scheduledDay?: ScheduledDay;
}

export interface EmployeeHoursInputTypeUpdateDTO {
  email?: string;
  automatic?: boolean;
  scheduledDay?: ScheduledDay;
}

export enum ScheduledDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}