import axios, { AxiosResponse } from 'axios';
import { BusinessCreationRequestDTO, EmployeeAccountRequestDTO } from '../dto/Accounts/AccountDTOs';

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

export const getAllEmployeeAccounts = async (): Promise<any> => {
  return axios.get(`/accounts/allEmployees`);
};

export const getAllEmployeeAccountsByEmail = async (businessEmail: string): Promise<any> => {
  return axios.get(`/accounts/allEmployees/${businessEmail}`);
};
