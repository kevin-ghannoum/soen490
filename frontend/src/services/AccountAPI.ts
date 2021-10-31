import axios, { AxiosPromise, AxiosResponse } from 'axios';
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

export const getAllRegexEmployeeAccount = async (emailPattern: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/accounts/employee`, { params: { email: emailPattern } });
};

export const getAllClientAccount = async (emailPattern: string): Promise<AxiosPromise<any>> => {
  return axios.get(`/accounts/client`, { params: { email: emailPattern } });
};
