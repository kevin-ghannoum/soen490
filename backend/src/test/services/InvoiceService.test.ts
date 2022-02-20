import 'reflect-metadata';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';
import { sequelizeMock } from '../helpers/SequelizeMock';
import InvoiceRepository from '../../main/repositories/InvoiceRepository';
import { InvoiceCreationDTO, PaymentType } from '../../main/dto/InvoiceDTO';
import { Invoice } from '../../main/models/Invoice';
import { InvoiceService } from '../../main/services/InvoiceService';

describe('InvoiceService tests', () => {
  let invoiceServiceMock: any = null;
  const date = new Date();

  beforeAll(() => {
    sequelizeMock();
  });

  beforeEach(() => {
    invoiceServiceMock = mock<InvoiceRepository>();
    container.registerInstance(InvoiceRepository, invoiceServiceMock);
  });

  afterEach(() => {
    container.clearInstances();
  });

  const INVOICE: InvoiceCreationDTO = {
    totalAmount: 23,
    paymentType: PaymentType.DEPOSIT,
    date: date,
    description: 'description',
    productionId: 1,
  };

  it('should create an invoice', async () => {
    invoiceServiceMock.create.mockResolvedValue(Invoice.build(INVOICE));

    const invoiceService = container.resolve(InvoiceService);
    const result = await invoiceService.createInvoice(INVOICE);
    expect(result.productionId).toBe(INVOICE.productionId);
    expect(result.paymentType).toBe(INVOICE.paymentType);
    expect(result.date).toBe(INVOICE.date);
    expect(result.description).toBe(INVOICE.description);
    expect(result.totalAmount).toBe(INVOICE.totalAmount);
  });

  it('Create invoice should fail because of missing value in request data', async () => {
    const INVOICE_MISSING = {};
    const invoiceService = container.resolve(InvoiceService);
    await expect(invoiceService.createInvoice(INVOICE_MISSING as unknown as InvoiceCreationDTO)).rejects.toThrowError(
      'Request data is missing some values'
    );
  });
});
