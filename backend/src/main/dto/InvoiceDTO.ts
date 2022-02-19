export interface InvoiceCreationDTO {
  totalAmount: number;
  paymentType: PaymentType;
  date: Date;
  description: string;
  productionId: number;
}
export interface InvoiceUpdateDTO {
  totalAmount?: number;
  paymentType?: PaymentType;
  date?: Date;
  description?: string;
}

export enum PaymentType {
  PROGRESS = 'PROGRESS',
  FINAL_PAYMENT = 'FINAL PAYMENT',
  DEPOSIT = 'DEPOSIT',
}
