/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';
import { getClientEmailProjectIntercept } from '../../helpers/projectIntercept';
import { getCallsFromCallerIntercept } from '../../helpers/callIntercept';

describe('editCall feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should edit a call log', () => {
    getClientEmailProjectIntercept();

    getCallsFromCallerIntercept('edit');

    cy.intercept(
      {
        method: 'PUT',
        url: '/call/*',
      },
      { fixture: 'editCallList.json', statusCode: 201 }
    ).as('editCallLogAPI');

    cy.wait(3000);
    cy.visit('/logs');

    cy.get('[data-field="edit"] > .MuiButtonBase-root > .MuiButton-label').click();

    cy.get('#selectClient').type('a@a.com');
    cy.get('#selectClient').type('{downarrow}{enter}');

    cy.get('#lock-button').click();
    cy.contains('Email sent').click();

    cy.get('#outlined-textarea').clear();
    cy.get('#outlined-textarea').type('This is an edit');

    cy.get('#editLog').click();

    cy.wait('@editCallLogAPI').its('response.statusCode').should('eq', 201);
  });
});
