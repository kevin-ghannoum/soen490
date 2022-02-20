/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { getProjectIntercept } from '../helpers/projectIntercept';
import { getExpenses, getProductions } from '../helpers/transactionIntercept';

describe('SingleProjectTransaction feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should view a single project', () => {
    cy.wait(500);
    getProjectIntercept();
    getExpenses();
    getProductions();

    cy.visit('/project_transaction/11');
    cy.get('#Single-Project-Transaction').should('exist');
  });
});
