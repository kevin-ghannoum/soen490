import axios from 'axios';
import { LogHoursCreationDTO } from '../dto/LogHours/LogHoursDTOs';

export const createLogHours = async (logHoursCreationDTO: LogHoursCreationDTO): Promise<any> => {
  return axios.post(`/logHours`, logHoursCreationDTO);
};

export const getInputTypeByEmail = async (email: String): Promise<any> => {
  return axios.get(`/logHours/inputType/${email}`);
};

export const getLatestPayByEmail = async (email: String): Promise<any> => {
  return axios.get(`/logHours/pay/latest/${email}`);
};
