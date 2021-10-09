export interface NotificationUpdateDTO {
  date?: Date;
  message?: string;
  type?: Type;
  email?: string;
}

export interface NotificationCreationDTO {
  date: Date;
  message: string;
  type: Type;
  email: string;
}

enum Type {
  EVENT = 'EVENT',
  SYSTEM = 'SYSTEM',
  REMINDER = 'REMINDER',
  GENERAL = 'GENERAL',
}
