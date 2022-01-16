import axios, { AxiosResponse } from 'axios';
import { LogHoursCreationDTO } from '../dto/LogHours/LogHoursDTOs';
import { PayUpdateDTO } from '../dto/LogHours/PayDTOs';

export const createLogHours = async (logHoursCreationDTO: LogHoursCreationDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/logHours`, logHoursCreationDTO);
};

export const updatePay = async (id: string, payUpdateDTO: PayUpdateDTO): Promise<AxiosResponse<any>> => {
  return axios.put(`/logHours/pay/${id}`, payUpdateDTO);
};

export const getInputTypeByEmail = async (email: String): Promise<AxiosResponse<any>> => {
  return axios.get(`/logHours/inputType/${email}`);
};

export const getLatestPayByEmail = async (email: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/logHours/pay/latest/${email}`);
};

export const getPayById = async (id: String): Promise<AxiosResponse<any>> => {
  return axios.get(`/logHours/pay/${id}`);
};

export const getAllBusinessPays = async (businessId: number): Promise<AxiosResponse<any>> => {
  return axios.get(`/logHours`, { params: { businessId: businessId } });
};
