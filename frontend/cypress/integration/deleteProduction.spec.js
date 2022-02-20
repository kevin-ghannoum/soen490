/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { getProjectIntercept } from '../helpers/projectIntercept';
import { getExpenses, getProductions, deleteProduction } from '../helpers/transactionIntercept';

describe('Edit Expense feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Delete a single project', () => {
    cy.wait(500);
    getProjectIntercept();
    getExpenses();
    getProductions();
    deleteProduction();

    cy.visit('/project_transaction/11');
    cy.get('#Single-Project-Transaction').should('exist');

    cy.intercept(
      {
        method: 'GET',
        url: '/transactions/productions?projectId=11',
      },
      { fixture: 'productionListAfterDelete.json', statusCode: 200, times: 1 }
    ).as('getUpdateProductionList');

    cy.wait(1000);
    cy.get(
      ':nth-child(2) > [colspan="6"] > .MuiCollapse-root > .MuiCollapse-wrapper > .MuiCollapse-wrapperInner > .MuiBox-root > .MuiTable-root > .MuiTableBody-root > :nth-child(1) > :nth-child(6) > .MuiButtonBase-root'
    ).click();
    cy.get('#deleteYes').click();
    cy.wait(500);
  });
});
