export interface SaleCreationDTO {
  amount: number;
  createdDate: Date;
  dueDate: Date;
  description: string;
  projectId: number;
}

export interface SaleUpdateDTO {
  id?: number;
  amount?: number;
  createdDate?: Date;
  dueDate?: Date;
  description?: string;
  projectId?: number;
}
