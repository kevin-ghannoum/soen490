/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { getProjectFromBusinessIntercept } from '../helpers/projectIntercept';
import { getExpensesForBusiness, getProductionsForBusiness } from '../helpers/transactionIntercept';

describe('ViewFinancials feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should view financials for business', () => {
    cy.wait(500);
    getProjectFromBusinessIntercept();
    getExpensesForBusiness();
    getProductionsForBusiness();

    cy.visit('/financials');
    cy.get('#View-Financials-Grid').should('exist');
  });
});
