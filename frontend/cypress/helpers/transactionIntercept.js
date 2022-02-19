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
    ).as('getExpensesAPI');
  };

  export const createExpense = () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/transactions/expenses',
      },
      { fixture: 'productionList.json', statusCode: 200, times: 1 }
    ).as('getExpensesAPI');
  };