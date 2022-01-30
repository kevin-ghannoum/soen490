export interface InvoiceDTO {
  quantity: number;
}

export interface InvoiceUpdateDTO {
  totalAmount: number | string;
  description: string;
  date: string;
  quantity: number | string;
}
