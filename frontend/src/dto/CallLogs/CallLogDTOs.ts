export interface CallCreationDTO {
  receiverName?: string;
  date: string;
  phoneNumber?: string;
  description: string;
  email: string;
  action: string;
  followUp: boolean;
  neverCallBack: boolean;
  employeeEmail: string;
}

export interface CallUpdateDTO {
  receiverName?: string;
  date?: string;
  phoneNumber?: string;
  description?: string;
  email?: string;
  action?: string;
  followUp?: boolean;
  neverCallBack?: boolean;
  employeeEmail?: string;
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