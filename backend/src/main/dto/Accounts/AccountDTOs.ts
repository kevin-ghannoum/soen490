import { AddressCreationDTO } from '../AddressDTOs';
import { BusinessCreationDTO } from '../BusinessDTO';

export interface AccountUpdateDTO {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  username?: string;
  password?: string;
  addressId?: number;
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
  addressId: number;
}

export interface AccountRequestDTO {
  account: AccountCreationDTO;
  address: AddressCreationDTO;
}

export interface EmployeeAccountRequestDTO {
  accountRequest: AccountRequestDTO;
  title: string;
  hourlyWage: number;
  supervisorEmail: string;
}

export interface ClientAccountCreationDTO {
  account: AccountCreationDTO;
  businessName: string;
  industry: string;
  website: string;
  status: Status;
}

export interface BusinessCreationRequestDTO extends AccountRequestDTO {
  businessInfo: BusinessCreationDTO;
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
  title: string;
  hourlyWage: number;
  supervisorEmail: string;
}

export interface EmployeeAccountCreationDTO {
  account: AccountCreationDTO;
  title: string;
  hourlyWage: number;
  supervisorEmail: string;
}

export interface EmployeeAccountUpdateDTO {
  account?: AccountUpdateDTO;
  title?: string;
  hourlyWage?: number;
  supervisorEmail?: string;
}

export interface AdminAccountCreationDTO {
  account: AccountCreationDTO;
}

export interface AdminAccountUpdateDTO {
  account?: AccountUpdateDTO;
}

export interface BusinessAccountCreationDTO {
  account: AccountCreationDTO;
}

export interface BusinessAccountUpdateDTO {
  account?: AccountUpdateDTO;
}
