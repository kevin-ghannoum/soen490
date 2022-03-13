import axios, { AxiosResponse } from 'axios';

export const getAllNotificationsByCurrentUser = async (): Promise<AxiosResponse<any>> => {
    return axios.get(`/notifications`);
};
  