import axios, { AxiosResponse } from 'axios';
import { BusinessCreationDTO } from '../dto/BusinessDTOs';

export const createCall = async (callCreationDTO: BusinessCreationDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/call`, callCreationDTO);
};

export const updateCall = async (id: number, callUpdateDTO: BusinessCreationDTO): Promise<AxiosResponse<any>> => {
  return axios.put(`/call/${id}`, callUpdateDTO);
};

export const getCalls = async (email: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/calls/${email}`);
};

export const deleteCall = async (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`/call/${id}`);
};
