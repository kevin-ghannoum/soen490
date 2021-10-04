export interface InvoiceCreationDTO {
  totalAmount: number;
  quantity: number;
  date: Date;
  description: string;
  productionId: number;
}
export interface InvoiceUpdateDTO {
  id?: number;
  totalAmount?: number;
  quantity?: number;
  date?: Date;
  description?: string;
  productionId: number;
}
