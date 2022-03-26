/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { updateBusinessIntercept, getAllBusinessesIntercept, getBusinessByIdIntercept } from '../helpers/businessIntercept';

describe('EditBusinessAccount feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  // Test user story: #208 As an admin, I want to manage businesses
  it('Should edit a business', () => {
    cy.wait(500);
    getAllBusinessesIntercept();
    updateBusinessIntercept();
    getBusinessByIdIntercept();

    cy.visit('/business');

    cy.get('#View-Business-Grid').should('exist');
    cy.wait(1000);
    cy.get(`[data-id="1"] > .MuiDataGrid-cell--withRenderer > .MuiSvgIcon-root`).click();
    cy.wait(2000);
    cy.get('input[name=website]').type('website link');

    cy.get('form').submit();

    cy.wait('@editBusinessAPI').its('response.statusCode').should('eq', 200);

  });
});
