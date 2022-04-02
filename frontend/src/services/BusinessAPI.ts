import axios, { AxiosResponse } from 'axios';
import { BusinessUpdateDTO } from '../dto/BusinessDTOs';

export const updateBusiness = async (id: string, businessUpdateDTO: BusinessUpdateDTO): Promise<AxiosResponse<any>> => {
  return axios.put(`/business/${id}`, businessUpdateDTO);
};

export const getAllBusinesses = async (): Promise<AxiosResponse<any>> => {
  return axios.get(`/businesses`);
};

export const getBusiness = async (id: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/business/${id}`);
};

export const deleteBusiness = async (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`/business/${id}`);
};

export const updateBusinessPassword = async (_businessUpdateDTO: BusinessUpdateDTO): Promise<AxiosResponse<any>> => {
  return axios.delete(`/business/password`);
};
