/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';

describe('EditProject feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should edit a project project', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/project?businessId=*',
      },
      { fixture: 'projectList.json', statusCode: 200 }
    ).as('getListOfProjectAPI');

    cy.intercept(
      {
        method: 'GET',
        url: '/accounts/client?email=*',
      },
      { fixture: 'clientList.json', statusCode: 200 }
    ).as('getClientAPI');

    cy.intercept(
      {
        method: 'GET',
        url: '/accounts/employee?email=*',
      },
      { fixture: 'employeeList.json', statusCode: 200 }
    ).as('getClientAPI');

    cy.intercept(
      {
        method: 'GET',
        url: '/project/11',
      },
      { fixture: 'getSingleProject.json', statusCode: 200, times: 1 }
    ).as('getProjectAPI');

    cy.intercept(
      {
        method: 'PUT',
        url: '/project/11',
      },
      { fixture: 'projectList.json', statusCode: 200 }
    ).as('updateProjectAPI');

    cy.visit('/projects');
    cy.wait(1000);
    cy.get('#View-Project-Grid').should('exist');
    cy.get(`[data-id="11"] > .MuiDataGrid-cell--withRenderer > .MuiTypography-root`).click();
    cy.get('#editButton').click();
    cy.get('input[name=title]').clear();
    cy.get('input[name=title]').type('This is the new title');

    cy.get('#selectEmployee').type('b@b.com');
    cy.get('#selectEmployee').type('{downarrow}{enter}');

    cy.get('#selectEmployee').type('c@c.com');
    cy.get('#selectEmployee').type('{downarrow}{enter}');

    cy.get('#description').clear();
    cy.get('#description').type('New description');
    cy.get('#saleDescription').clear();
    cy.get('#saleDescription').type('New Sale Description');
    cy.get('#extraNotes').clear();
    cy.get('#extraNotes').type('New Extra Notes');

    cy.get('form').submit();

    cy.intercept(
      {
        method: 'GET',
        url: '/project?businessId=*',
      },
      { fixture: 'updateProject.json', statusCode: 200, times: 1 }
    ).as('getListOfProjectAPI');
  });
<<<<<<< HEAD
})
=======
});
>>>>>>> 52dbf4e (Format with prettier)
