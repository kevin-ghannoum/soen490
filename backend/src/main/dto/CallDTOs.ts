export interface CallUpdateDTO {
  receiverName?: string;
  date?: Date;
  phoneNumber?: string;
  description?: string;
  email?: string;
  action?: Action;
  followUp?: boolean;
  neverCallBack?: boolean;
  employeeEmail?: string;
}

export interface CallCreationDTO {
  receiverName?: string;
  date: Date;
  phoneNumber?: string;
  description: string;
  email: string;
  action: Action;
  followUp: boolean;
  neverCallBack: boolean;
  employeeEmail: string;
}

export enum Action {
  CALLED = 'CALLED',
  NO_ANSWER = 'NO ANSWER',
  LEFT_VOICEMAIL = 'LEFT VOICEMAIL',
  EMAIL_SENT = 'EMAIL SENT',
  FOLLOW_UP = 'FOLLOW UP',
  CALL_BACK = 'CALL BACK',
  WILL_CALL_BACK = 'WILL CALL BACK',
  ESTIMATE_BOOKED = 'ESTIMATE BOOKED'
}