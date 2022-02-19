/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import { getProjectFromBusinessIntercept } from '../helpers/projectIntercept';

describe('ViewProject feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should view a list of project', () => {
    cy.wait(500);
    getProjectFromBusinessIntercept();

    cy.visit('/projects');
    cy.get('#View-Project-Grid').should('exist');
  });
});
