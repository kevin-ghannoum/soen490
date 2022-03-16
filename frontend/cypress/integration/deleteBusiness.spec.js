/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { deletebusinessIntercept, getAllBusinessesIntercept } from '../helpers/businessIntercept';

describe('DeleteBusinessAccount feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  // Test user story: #208 As an admin, I want to manage businesses
  it('Should delete a business', () => {
    cy.wait(500);
    getAllBusinessesIntercept();
    deletebusinessIntercept();

    cy.visit('/business');

    cy.get('#View-Business-Grid').should('exist');
    cy.wait(1000);
    cy.get(`[data-id="1"] > .MuiDataGrid-cell--withRenderer > .MuiButton-root`).click();

    cy.get('#deleteYes').click();

    cy.wait('@deleteBusinessAPI').its('response.statusCode').should('eq', 200);

  });
});
