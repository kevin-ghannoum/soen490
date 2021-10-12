import axios, { AxiosResponse } from 'axios';
import { EmployeeAccountRequestDTO } from '../dto/Accounts/AccountDTOs';

export const createEmployeeAccount = async (employeeAccountRequestDTO: EmployeeAccountRequestDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/accounts/employee`, employeeAccountRequestDTO);
};
