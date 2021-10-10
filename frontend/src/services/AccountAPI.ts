import axios from 'axios';
import { EmployeeAccountRequestDTO } from '../dto/Accounts/AccountDTOs';

export const createEmployeeAccount = async (employeeAccountRequestDTO: EmployeeAccountRequestDTO): Promise<any> => {
  return axios.post(`/accounts/employee`, employeeAccountRequestDTO);
};
