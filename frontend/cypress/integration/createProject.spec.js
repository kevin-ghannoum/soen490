/// <reference types="cypress" />

import { loginIntercept } from '../helpers/loginIntercept';

describe('CreateProject feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should create a new project', () => {
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
        method: 'POST',
        url: '/project',
      },
      { fixture: 'clientList.json', statusCode: 201 }
    ).as('createProjectAPI');

    cy.intercept(
      {
        method: 'GET',
        url: '/project?businessId=*',
      },
      { fixture: 'projectCreated.json', statusCode: 200 }
    ).as('getListOfProjectAPI');

    cy.wait(3000);
    cy.visit('/project');
    cy.get('#selectStatus').parent().click();
    cy.get('#booked').click();

    cy.get('#selectClient').type('a@a.com');
    cy.get('#selectClient').type('{downarrow}{enter}');

    cy.get('#selectEmployee').type('employee');
    cy.get('#selectEmployee').type('{downarrow}{enter}');

    cy.get('#selectEmployee').type('Carlos');
    cy.get('#selectEmployee').type('{downarrow}{enter}');

    cy.get('input[name=title]').type('My Project Title');
    cy.get('input[name=leadSource]').type('lead Source');

    cy.get('input[name=leadRanking]').type('lead Ranking');

    cy.get('#leadCredit').type('Carlos');
    cy.get('#leadCredit').type('{downarrow}{enter}');

    cy.get('#description').type('this is a description');
    cy.get('input[name=serviceType]').type('service');
    cy.get('input[name=saleValue]').type(100);
    cy.get('#saleDescription').type('this is a sale description');
    cy.get('#extraNotes').type('extra notes');

    cy.get('#dateFollow').type('2028-10-12');
    cy.get('#dateDeadline').type('2030-10-12');

    cy.get('form').submit();
    cy.wait('@createProjectAPI').its('response.statusCode').should('eq', 201);
  });
});
