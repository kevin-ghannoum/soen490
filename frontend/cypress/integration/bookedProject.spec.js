/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { getBookedProjectFromBusinessIntercept } from '../helpers/projectIntercept';

describe('BookedProject feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should view a list of booked project', () => {
    getBookedProjectFromBusinessIntercept();

    cy.visit('/booked_projects_transactions');
    cy.wait('@getListOfBookedProjectAPI');
    cy.get('#View-Booked-Project-Grid').should('exist');
  });
});
