export interface EmployeeHoursInputTypeCreationDTO {
  email: string;
  inputType: InputType;
  scheduledDay?: ScheduledDay;
}

export interface EmployeeHoursInputTypeUpdateDTO {
  email?: string;
  inputType?: InputType;
  scheduledDay?: ScheduledDay;
}

export enum InputType {
  MANUAL = 'MANUAL',
  AUTOMATIC = 'AUTOMATIC',
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