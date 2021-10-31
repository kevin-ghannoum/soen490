import axios, { AxiosPromise, AxiosResponse } from 'axios';
import { ProjectRequestDTO, ProjectUpdateRequestDTO } from '../dto/ProjectDTOs';

export const createProject = async (projectResquestionDTO: ProjectRequestDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/project`, projectResquestionDTO);
};

export const getAllBusinessProject = async (businessId: number): Promise<AxiosPromise<any>> => {
  return axios.get(`/project`, { params: { businessId: businessId } });
};

export const getProject = async (projectId: string): Promise<AxiosPromise<any>> => {
  return axios.get(`/project/${projectId}`);
};

export const updateProject = async (projectUpdateRequestDTO: ProjectUpdateRequestDTO): Promise<AxiosPromise<any>> => {
  return axios.put(`/project/${projectUpdateRequestDTO.project.id}`, projectUpdateRequestDTO);
};