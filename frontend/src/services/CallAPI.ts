import axios, { AxiosResponse } from 'axios';
import { CallCreationDTO, CallUpdateDTO } from '../dto/CallLogs/CallLogDTOs';

export const createCall = async (callCreationDTO: CallCreationDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/call`, callCreationDTO);
};

export const updateCall = async (id: number, callUpdateDTO: CallUpdateDTO): Promise<AxiosResponse<any>> => {
  return axios.put(`/call/${id}`, callUpdateDTO);
};

export const getCalls = async (email: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/calls/${email}`);
};

export const deleteCall = async (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`/call/${id}`);
};
