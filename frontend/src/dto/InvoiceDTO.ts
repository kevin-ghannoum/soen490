export interface InvoiceDTO {
  paymentType: string;
}

export interface InvoiceUpdateDTO {
  totalAmount: number | string;
  description: string;
  date: string;
  paymentType: string;
}
