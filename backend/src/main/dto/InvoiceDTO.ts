export interface InvoiceCreationDTO {
  totalAmount: number;
  quantity: number;
  date: Date;
  description: string;
  productionId: number;
}
export interface InvoiceUpdateDTO {
  totalAmount?: number;
  quantity?: number;
  date?: Date;
  description?: string;
}
