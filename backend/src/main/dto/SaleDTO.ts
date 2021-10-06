export interface SaleCreationDTO {
  amount: number;
  createdDate: Date;
  dueDate: Date;
  description: string;
  projectId: number;
}

export interface SaleUpdateDTO {
  amount?: number;
  createdDate?: Date;
  dueDate?: Date;
  description?: string;
  projectId?: number;
}
