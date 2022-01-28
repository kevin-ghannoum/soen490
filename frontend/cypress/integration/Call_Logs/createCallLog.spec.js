/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';
import { getClientEmailProjectIntercept } from '../../helpers/projectIntercept';
import { getCallsFromCallerIntercept } from '../../helpers/callIntercept';

describe('CreateCallLogs feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should create a new call log', () => {
    getClientEmailProjectIntercept();

    getCallsFromCallerIntercept();

    cy.intercept(
      {
        method: 'POST',
        url: '/call',
      },
      { fixture: 'callList.json', statusCode: 201 }
    ).as('createCallLogAPI');

    cy.visit('/logs');

    cy.wait('@getCallLogAPI');

    cy.get('#addLog').click();

    cy.get('#selectClient').type('a@a.com');
    cy.get('#selectClient').type('{downarrow}{enter}');

    cy.get('#lock-button').click();
    cy.contains('Left Voicemail').click();

    cy.get('#outlined-textarea').type('This is a test');

    cy.get('#createLog').click();

    cy.wait('@createCallLogAPI').its('response.statusCode').should('eq', 201);
  });
});
