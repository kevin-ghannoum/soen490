/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';
import {
  getProjectFromBusinessIntercept,
  getClientEmailProjectIntercept,
  getEmployeeEmailProjectIntercept,
  getProjectIntercept,
  updateProjectIntercept,
} from '../helpers/projectIntercept';

describe('EditProject feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should edit a project project', () => {
    getProjectFromBusinessIntercept();
    getEmployeeEmailProjectIntercept();
    getClientEmailProjectIntercept();
    getProjectIntercept();
    updateProjectIntercept();

    cy.visit('/projects');
    cy.wait(3000);
    cy.get('#View-Project-Grid').should('exist');
    cy.get(`[data-id="11"] > .MuiDataGrid-cell--withRenderer > .MuiTypography-root`).click();
    cy.get('#editButton').click();
    cy.get('input[name=title]').clear();
    cy.get('input[name=title]').type('This is the new title');

    cy.get('#selectEmployee').type('carlos');
    cy.get('#selectEmployee').type('{downarrow}{enter}');

    cy.get('#description').clear();
    cy.get('#description').type('New description');
    cy.get('#saleDescription').clear();
    cy.get('#saleDescription').type('New Sale Description');
    cy.get('#extraNotes').clear();
    cy.get('#extraNotes').type('New Extra Notes');

    cy.get('#dateFollow').type('2028-10-12');
    cy.get('#dateDeadline').type('2030-10-12');

    cy.get('form').submit();

    cy.intercept(
      {
        method: 'GET',
        url: '/project?businessId=*',
      },
      { fixture: 'updateProject.json', statusCode: 200, times: 1 }
    ).as('getListOfProjectAPI');
  });
});
