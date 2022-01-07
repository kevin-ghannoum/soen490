import axios, { AxiosResponse } from 'axios';
import { LogHoursCreationDTO } from '../dto/LogHours/LogHoursDTOs';

export const createLogHours = async (logHoursCreationDTO: LogHoursCreationDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/logHours`, logHoursCreationDTO);
};

export const getInputTypeByEmail = async (email: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/logHours/inputType/${email}`);
};

export const getLatestPayByEmail = async (email: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/logHours/pay/latest/${email}`);
};
