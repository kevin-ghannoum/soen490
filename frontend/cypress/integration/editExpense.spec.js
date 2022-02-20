/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { getProjectIntercept } from '../helpers/projectIntercept';
import { getExpenses, getProductions, getExpense, updateExpense, getExpensesAfterEdit } from '../helpers/transactionIntercept';

describe('Edit Expense feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should Edit a single project', () => {
    cy.wait(500);
    getProjectIntercept();
    getExpenses();
    getExpense();
    getProductions();
    updateExpense();

    cy.visit('/project_transaction/11');
    cy.get('#Single-Project-Transaction').should('exist');
    cy.wait(1000);
    cy.get(
      ':nth-child(2) > [colspan="6"] > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiBox-root > .MuiTable-root > .MuiTableBody-root > :nth-child(1) > :nth-child(5) > .MuiButtonBase-root > .MuiButton-label'
    ).click();
    cy.get('#description').clear();
    cy.get('#description').type('new description');
    cy.get('form').submit();

    getExpensesAfterEdit();

  });
});
