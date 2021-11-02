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
  return axios.post(`/accounts/business`, businessAccountRequestDTO);
};

export const createClientAccount = async (
  clientAccountCreationRequestDTO: ClientAccountCreationRequestDTO
): Promise<AxiosResponse<any>> => {
  console.log(clientAccountCreationRequestDTO)
  return axios.post(`/accounts/client`, clientAccountCreationRequestDTO);
};

export const getAllEmployeeAccounts = async (): Promise<AxiosResponse<any>> => {
  return axios.get(`/accounts/allEmployees`);
};

export const getAllEmployeeAccountsByEmail = async (businessEmail: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/accounts/allEmployees/${businessEmail}`);
};
export const getAllRegexEmployeeAccount = async (emailPattern: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/accounts/employee`, { params: { email: emailPattern } });
};

export const getAllClientAccount = async (emailPattern: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/accounts/client`, { params: { email: emailPattern } });
};
