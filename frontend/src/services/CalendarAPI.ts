import axios, { AxiosResponse } from 'axios';
import { CreateEventData } from '../components/Calendar/EventCreationForm';

export const getEvents = (): Promise<AxiosResponse<any>> => {
  return axios.get('/event');
};

export const createEvents = (event: CreateEventData): Promise<AxiosResponse<any>> => {
  return axios.post('/event', event);
};
