/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';
import { getClientEmailProjectIntercept } from '../../helpers/projectIntercept';
import { getCallsFromCallerIntercept } from '../../helpers/callIntercept';

describe('DeleteCallLogs feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should delete a call log', () => {
    getClientEmailProjectIntercept();

    getCallsFromCallerIntercept('delete');

    cy.intercept(
      {
        method: 'DELETE',
        url: '/call/*',
      },
      { fixture: 'callList.json', statusCode: 200 }
    ).as('deleteCallLogAPI');

    cy.visit('/logs');

    cy.get('.Mui-odd > [data-field="delete"] > .MuiButtonBase-root > .MuiButton-label').click();

    cy.get('.MuiDialogActions-root > .MuiButton-contained').click();

    cy.wait('@deleteCallLogAPI').its('response.statusCode').should('eq', 200);
  });
});
