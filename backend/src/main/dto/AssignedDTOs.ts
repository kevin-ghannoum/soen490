export interface AssignedCreationDTO {
  taskId: number;
  email: string;
}

export interface AssignedUpdateDTO {
  taskId?: number;
  email?: string;
}

export interface MultipleAssignedCreationDTO {
  taskId: number;
  emails: string[];
}