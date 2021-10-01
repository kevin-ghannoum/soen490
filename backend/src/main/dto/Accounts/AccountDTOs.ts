export interface AccountUpdateDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  username?: string;
  password?: string;
}

export interface ClientAccountUpdateDTO {
  account?: AccountUpdateDTO;
  businessName?: string;
  industry?: string;
  website?: string;
  status?: Status;
}

export interface AccountCreationDTO {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  username: string;
  password: string;
}

export interface ClientAccountCreationDTO {
  account: AccountCreationDTO;
  businessName: string;
  industry: string;
  website: string;
  status: Status;
}

enum Status {
  LEAD = 'LEAD',
  SCHEDULE = 'SCHEDULED',
  REJECTED = 'REJECTED',
  TO_BE_RESCHEDULED = 'TO BE RESCHEDULED',
  PENDING = 'PENDING',
}

export interface EmployeeAccountCreationDTO {
  account: AccountCreationDTO;
  title:string;
  hourlyWage:number;
  supervisorEmail:string
}

export interface EmployeeAccountUpdateDTO {
  account?: AccountUpdateDTO
  title?: string
  hourlyWage?:number
  supervisorEmail?:string
}