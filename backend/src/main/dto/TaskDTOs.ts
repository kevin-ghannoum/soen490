export interface TaskCreationDTO {
  title: string;
  description: string;
  status: TaskStatus;
  deadlineDate: Date;
  createdDate: Date;
  modifiedDate: Date;
  projectId?: number;
}

export interface TaskUpdateDTO {
  title?: string;
  description?: string;
  status?: TaskStatus;
  deadlineDate?: Date;
  createdDate?: Date;
  modifiedDate?: Date;
  projectId?: number;
}

export enum TaskStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  REMOVED = 'REMOVED',
}
