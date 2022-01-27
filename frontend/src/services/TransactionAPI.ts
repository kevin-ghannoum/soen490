import axios, { AxiosPromise, AxiosResponse } from 'axios';
import {
  createExpenseDTO,
  createProductionDTO,
  TransactionExpenseUpdateDTO,
  TransactionProductionUpdateDTO,
} from '../dto/TransactionDTOs';

export const getExpensesForProject = async (projectId: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/transactions/expenses`, { params: { projectId: projectId } });
};

export const getProductionsForProject = async (projectId: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/transactions/productions`, { params: { projectId: projectId } });
};

export const getExpense = async (id: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/transaction/expense`, { params: { id: id } });
};

export const getProduction = async (id: string): Promise<AxiosResponse<any>> => {
  return axios.get(`/transaction/production`, { params: { id: id } });
};

export const createExpense = async (createExpenseDTO: createExpenseDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/transactions/expenses`, createExpenseDTO);
};

export const createProduction = async (createProductionDTO: createProductionDTO): Promise<AxiosResponse<any>> => {
  return axios.post(`/transactions/productions`, createProductionDTO);
};

export const deleteExpense = async (id: Number): Promise<AxiosResponse<any>> => {
  return axios.delete(`/transactions/expenses`, { params: { transactionId: id } });
};

export const deleteProduction = async (id: Number): Promise<AxiosResponse<any>> => {
  return axios.delete(`/transactions/productions`, { params: { transactionId: id } });
};

export const updateExpense = async (
  transactionExpenseUpdateDTO: TransactionExpenseUpdateDTO
): Promise<AxiosPromise<any>> => {
  return axios.put(`/transactions/expenses`, transactionExpenseUpdateDTO);
};

export const updateProduction = async (
  transactionProductionUpdateDTO: TransactionProductionUpdateDTO
): Promise<AxiosPromise<any>> => {
  return axios.put(`/transactions/productions`, transactionProductionUpdateDTO);
};
