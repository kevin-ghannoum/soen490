export const getExpenses = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/transactions/expenses?projectId=11',
    },
    { fixture: 'expenseList.json', statusCode: 200, times: 1 }
  ).as('getExpensesAPI');
};

export const getProductions = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/transactions/productions?projectId=11',
    },
    { fixture: 'productionList.json', statusCode: 200, times: 1 }
  ).as('getProductionsAPI');
};

export const createExpense = () => {
  cy.intercept(
    {
      method: 'POST',
      url: '/transactions/expenses',
    },
    { fixture: 'expenseList.json', statusCode: 200, times: 1 }
  ).as('createExpensesAPI');
};

export const createProduction = () => {
  cy.intercept(
    {
      method: 'POST',
      url: '/transactions/productions',
    },
    { fixture: 'productionCreate.json', statusCode: 201, times: 1 }
  ).as('createProductionAPI');
};

export const getExpense = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/transaction/expense?id=18',
    },
    { fixture: 'expense.json', statusCode: 200, times: 1 }
  ).as('getSingleExpenseAPI');
};

export const getProduction = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/transaction/production?id=20',
    },
    { fixture: 'production.json', statusCode: 200, times: 1 }
  ).as('getSingleProductionAPI');
};

export const updateExpense = () => {
  cy.intercept(
    {
      method: 'PUT',
      url: '/transactions/expenses',
    },
    { fixture: 'expenseUpdate.json', statusCode: 200, times: 1 }
  ).as('updateSingleExpenseAPI');
};

export const updateProduction = () => {
  cy.intercept(
    {
      method: 'PUT',
      url: '/transactions/productions',
    },
    { fixture: 'productionUpdate.json', statusCode: 200, times: 1 }
  ).as('updateSingleProductionAPI');
};

export const deleteExpense = () => {
  cy.intercept(
    {
      method: 'DELETE',
      url: '/transaction?transactionId=18',
    },
    { fixture: 'expenseToDelete.json', statusCode: 200, times: 1 }
  ).as('expenseToDeleteAPI');
};

export const deleteProduction = () => {
  cy.intercept(
    {
      method: 'DELETE',
      url: '/transaction?transactionId=18',
    },
    { fixture: 'expenseToDelete.json', statusCode: 200, times: 1 }
  ).as('expenseToDeleteAPI');
};
