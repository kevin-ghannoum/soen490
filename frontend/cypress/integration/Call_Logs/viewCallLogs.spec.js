/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';
import { getCallsFromCallerIntercept } from '../../helpers/callIntercept';

describe('ViewCalls feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should view a list of calls', () => {
    getCallsFromCallerIntercept();

    cy.visit('/logs');

    cy.wait('@getListOfCallAPI');

    cy.wait(4000);

    cy.get('#View-Logs-Grid').should('exist');
  });
});
