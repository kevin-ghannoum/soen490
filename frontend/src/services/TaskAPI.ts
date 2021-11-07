import axios, { AxiosResponse } from 'axios';
import { TaskCreationDTO, TaskUpdateDTO } from '../dto/TaskDTOs';

export const createTask = async (taskCreationDTO: TaskCreationDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/task`, taskCreationDTO);
};

export const getAllTask = async (): Promise<AxiosResponse<any>> => {
  return axios.get(`/task`);
};

export const getTaskById = async (taskId: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/task/${taskId}`);
};

export const updateTaskById = async (taskId: string, taskUpdateDTO: TaskUpdateDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/task/${taskId}`, taskUpdateDTO);
};
export const deleteTaskById = async (taskId: string): Promise<AxiosResponse<any>> => {
  return axios.delete(`/task/${taskId}`);
};
