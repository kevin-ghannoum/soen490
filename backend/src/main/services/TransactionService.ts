import debug from 'debug';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import { InvoiceCreationDTO } from '../dto/InvoiceDTO';
import {
  BusinessExpensesPerProjectDTO,
  BusinessProductionsPerProjectDTO,
  ExpenseRequestDTO,
  ExpenseUpdateRequestDTO,
  ProductionRequestDTO,
  ProductionUpdateRequestDTO,
  TransactionCreationDTO,
  TransactionUpdateDTO,
} from '../dto/Transaction/TransactionDTO';
import HttpException from '../exceptions/HttpException';
import { Project } from '../models/Project';
import { Transaction } from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionRepository';
import { ExpenseService } from './ExpenseService';
import { InvoiceService } from './InvoiceService';
import { ProductionService } from './ProductionService';
import { ProjectService } from './ProjectService';

const log: debug.IDebugger = debug('app:TransactionService');

@injectable()
export class TransactionService {
  constructor(
    private projectService: ProjectService,
    private transactionRepository: TransactionRepository,
    private expenseService: ExpenseService,
    private productionService: ProductionService,
    private invoiceService: InvoiceService
  ) {
    log('Created instance of TransactionService');
  }

  public getAllTransactionsForProjects = async (projectId: number): Promise<Transaction[] | null> => {
    return this.transactionRepository.getAllTransactionForProject(projectId);
  };

  public createTransactionExpense = async (expenseRequestDTO: ExpenseRequestDTO): Promise<Transaction> => {
    if (TransactionService.isThereNullValueTransactionCreationDTO(expenseRequestDTO.transaction)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const transaction: Transaction = await this.transactionRepository.create(expenseRequestDTO.transaction);

    expenseRequestDTO.expense.id = transaction.id;
    await this.expenseService.createExpense(expenseRequestDTO.expense);

    return Promise.resolve(transaction);
  };

  public createTransactionProduction = async (productionRequestDTO: ProductionRequestDTO): Promise<Transaction> => {
    if (TransactionService.isThereNullValueTransactionCreationDTO(productionRequestDTO.transaction)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const transaction: Transaction = await this.transactionRepository.create(productionRequestDTO.transaction);
    productionRequestDTO.production.id = transaction.id;
    const production = await this.productionService.createProduction(productionRequestDTO.production);

    const invoice: InvoiceCreationDTO = {
      totalAmount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      productionId: production.id,
      paymentType: productionRequestDTO.paymentType,
    };

    await this.invoiceService.createInvoice(invoice);
    return Promise.resolve(transaction);
  };

  public getAllProductionsForBusinessPerProject = async (
    businessId: number
  ): Promise<BusinessProductionsPerProjectDTO[]> => {
    const data: BusinessProductionsPerProjectDTO[] = [];
    const projectIds: { projectId: number; name: string }[] = [];
    const projectOfBusiness = await this.projectService.getProjectofBusiness(Number(businessId));
    projectOfBusiness?.forEach((project: Project) => {
      projectIds.push({ projectId: project.id, name: project.title });
    });
    for (const project of projectIds) {
      let productionForProject = 0;
      const productionsOfProject = await this.productionService.getAllProductionsForProject(Number(project.projectId));
      productionsOfProject?.forEach((element: any) => {
        const prodValue = element.dataValues.transaction.dataValues.amount;
        productionForProject = productionForProject + prodValue;
      });
      data.push({ projectId: project.projectId, value: productionForProject, name: project.name });
    }
    return Promise.resolve(data);
  };

  public getAllExpensesForBusinessPerProject = async (businessId: number): Promise<BusinessExpensesPerProjectDTO[]> => {
    const data: BusinessExpensesPerProjectDTO[] = [];
    const projectIds: { projectId: number; name: string }[] = [];
    const projectOfBusiness = await this.projectService.getProjectofBusiness(Number(businessId));
    projectOfBusiness?.forEach((project: Project) => {
      projectIds.push({ projectId: project.id, name: project.title });
    });
    for (const project of projectIds) {
      let wagesExpensesForProject = 0;
      let toolsExpensesForProject = 0;
      let othersExpensesForProject = 0;
      const expensesOfProject = await this.expenseService.getAllExpensesForProjects(Number(project.projectId));
      expensesOfProject?.forEach((element: any) => {
        const expenseValue = element.dataValues.transaction.dataValues.amount;
        console.log(element.dataValues.type);
        if (element.dataValues.type === 'WAGES') {
          wagesExpensesForProject = wagesExpensesForProject + expenseValue;
        } else if (element.dataValues.type === 'TOOLS') {
          toolsExpensesForProject = toolsExpensesForProject + expenseValue;
        } else if (element.dataValues.type === 'OTHER') {
          othersExpensesForProject = othersExpensesForProject + expenseValue;
        }
      });
      data.push({
        projectId: project.projectId,
        wagesValue: wagesExpensesForProject,
        toolsValue: toolsExpensesForProject,
        othersValue: othersExpensesForProject,
        name: project.name,
      });
    }
    return Promise.resolve(data);
  };

  public updateTransactionExpense = async (expenseUpdateRequestDTO: ExpenseUpdateRequestDTO): Promise<number> => {
    if (TransactionService.isThereNullValueTransactionUpdateDTO(expenseUpdateRequestDTO.transaction)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const updatedTransactionExpense = await this.transactionRepository.update(
      expenseUpdateRequestDTO.id,
      expenseUpdateRequestDTO.transaction
    );
    await this.expenseService.updateExpense(expenseUpdateRequestDTO.id, expenseUpdateRequestDTO.expense);
    return Promise.resolve(updatedTransactionExpense);
  };

  public updateTransactionProduction = async (
    productionUpdateRequestDTO: ProductionUpdateRequestDTO
  ): Promise<number> => {
    if (TransactionService.isThereNullValueTransactionUpdateDTO(productionUpdateRequestDTO.transaction)) {
      throw new HttpException(StatusCodes.BAD_REQUEST, 'Request data is missing some values');
    }

    const updatedTransactionProduction = await this.transactionRepository.update(
      productionUpdateRequestDTO.id,
      productionUpdateRequestDTO.transaction
    );

    await this.invoiceService.updateInvoice(productionUpdateRequestDTO.id, productionUpdateRequestDTO.invoice);
    return Promise.resolve(updatedTransactionProduction);
  };

  public deleteTransaction = async (transactionId: number): Promise<number> => {
    return this.transactionRepository.delete(transactionId);
  };

  public static isThereNullValueTransactionCreationDTO = (transactionCreationDTO: TransactionCreationDTO): boolean => {
    if (
      transactionCreationDTO === undefined ||
      !transactionCreationDTO.date ||
      !transactionCreationDTO.amount ||
      !transactionCreationDTO.description ||
      !transactionCreationDTO.projectId
    ) {
      return true;
    }
    return false;
  };

  public static isThereNullValueTransactionUpdateDTO = (transactionUpdateDTO: TransactionUpdateDTO): boolean => {
    if (
      transactionUpdateDTO === undefined ||
      !transactionUpdateDTO.date ||
      !transactionUpdateDTO.amount ||
      !transactionUpdateDTO.description
    ) {
      return true;
    }
    return false;
  };
}
