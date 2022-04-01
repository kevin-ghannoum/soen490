/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';

describe('ViewFAQ feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should view a table of FAQ', () => {
    cy.visit('/faq');

    cy.wait(3000);
    cy.get('#faqTable').should('exist');
  });
});
