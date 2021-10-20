import axios from 'axios';
import { LogHoursCreationDTO } from '../dto/LogHours/LogHoursDTOs';

export const createLogHours = async (logHoursCreationDTO: LogHoursCreationDTO): Promise<any> => {
  return axios.post(`/logHours`, logHoursCreationDTO);
};
