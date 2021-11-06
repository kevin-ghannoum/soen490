import axios, { AxiosResponse } from 'axios';
import { MultipleAssignedCreationDTO } from '../dto/AssignedDTOs';

export const createAssignment = async (
  multipleAssignedCreationDTO: MultipleAssignedCreationDTO
): Promise<AxiosResponse<any>> => {
  return axios.post(`/multipleAssigned`, multipleAssignedCreationDTO);
};

export const getAssignedByTaskId = async (taskId: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/assignedByTaskId/${taskId}`);
};

export const updateAssignedByTaskId = async (
  multipleAssignedCreationDTO: MultipleAssignedCreationDTO
): Promise<AxiosResponse<any>> => {
  return axios.post(`/assignedByTaskId/${multipleAssignedCreationDTO.taskId}`, multipleAssignedCreationDTO);
};

export const deleteAssignedByTaskId = async (taskId: string): Promise<AxiosResponse<any>> => {
  return axios.delete(`/assignedByTaskId/${taskId}`);
};
