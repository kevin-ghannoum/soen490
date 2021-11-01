import { EmployeeHoursInputTypeCreationDTO } from './EmployeeHoursInputTypeDTOs';
import { PayCreationDTO } from './PayDTOs';

export interface LogHoursCreationDTO {
  employeeHoursInputType: EmployeeHoursInputTypeCreationDTO;
  pay: PayCreationDTO;
}
