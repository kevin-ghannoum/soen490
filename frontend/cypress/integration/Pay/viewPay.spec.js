/// <reference types="cypress" />

import { getAllBusinessPaysIntercept } from '../../helpers/payIntercept';
import { loginIntercept } from '../../helpers/loginIntercept';

describe('View Pays feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should view a list of pays', () => {
    getAllBusinessPaysIntercept();

    cy.visit('/employees');
    cy.get('#View-Pay-Grid').should('exist');
  });
});
