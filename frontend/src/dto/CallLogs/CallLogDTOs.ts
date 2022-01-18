export interface CallUpdateDTO {
  receiverName?: string;
  date?: string;
  phoneNumber?: string;
  description?: string;
  receiverEmail?: string;
  action?: string;
  followUp?: boolean;
  neverCallBack?: boolean;
  callerEmail?: string;
}

export interface CallCreationDTO {
  receiverName?: string;
  date: string;
  phoneNumber?: string;
  description: string;
  receiverEmail: string;
  action: string;
  followUp: boolean;
  neverCallBack: boolean;
  callerEmail: string;
}
