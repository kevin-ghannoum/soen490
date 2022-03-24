import axios, { AxiosResponse } from 'axios';
import { CreateEventData, EventUpdateDTO } from '../components/Calendar/EventCreationForm';

export const getEvents = (): Promise<AxiosResponse<any>> => {
  return axios.get('/event');
};

export const createEvents = (event: CreateEventData): Promise<AxiosResponse<any>> => {
  return axios.post('/event', event);
};

export const updateEvents = (event: EventUpdateDTO): Promise<AxiosResponse<any>> => {
  return axios.put(`/event/${event.id}`, event);
};

export const deleteEvent = (id: number): Promise<AxiosResponse<any>> => {
  return axios.delete(`event/${id}`);
};

export const confirmEvent = (id: number, status: string, email: string): Promise<AxiosResponse<any>> => {
  return axios.post(`event/${id}/accept?email=${email}&accepted=${status}`);
};
