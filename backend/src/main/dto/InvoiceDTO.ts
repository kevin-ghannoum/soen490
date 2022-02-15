export interface InvoiceCreationDTO {
  totalAmount: number;
  paymentType: paymentType;
  date: Date;
  description: string;
  productionId: number;
}
export interface InvoiceUpdateDTO {
  totalAmount?: number;
  paymentType?: paymentType;
  date?: Date;
  description?: string;
}

export enum paymentType {
  PROGRESS = 'PROGRESS',
  FINAL_PAYMENT = 'FINAL PAYMENT',
  DEPOSIT = 'DEPOSIT',
}
