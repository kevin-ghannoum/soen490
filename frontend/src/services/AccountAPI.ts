import axios, { AxiosResponse } from 'axios';
import {
  BusinessCreationRequestDTO,
  ClientAccountCreationRequestDTO,
  EmployeeAccountRequestDTO,
} from '../dto/Accounts/AccountDTOs';

export const createEmployeeAccount = async (
  employeeAccountRequestDTO: EmployeeAccountRequestDTO
): Promise<AxiosResponse<any>> => {
  return axios.post(`/accounts/employee`, employeeAccountRequestDTO);
};

export const createBusinessAccount = async (
  businessAccountRequestDTO: BusinessCreationRequestDTO
): Promise<AxiosResponse<any>> => {
  return axios.post(`accounts/business`, businessAccountRequestDTO);
};

export const createClientAccount = async (
  clientAccountCreationRequestDTO: ClientAccountCreationRequestDTO
): Promise<AxiosResponse<any>> => {
  return axios.post(`accounts/client`, clientAccountCreationRequestDTO);
};
