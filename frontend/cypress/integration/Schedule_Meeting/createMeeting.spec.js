/// <reference types="cypress" />
import { createEventIntercept, getEventsDataIntercept } from '../../helpers/eventScheduleIntercept';
import { loginIntercept } from '../../helpers/loginIntercept';

describe('Create a meeting', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should create a meeting', () => {
    getEventsDataIntercept();

    cy.intercept(
      {
        method: 'GET',
        url: '/accounts/employee?email=*',
      },
      { fixture: 'employeeList.json', statusCode: 200 }
    ).as('getClientAPI');

    createEventIntercept();

    cy.visit('/calendar');
    // Wednesday
    cy.get(':nth-child(5) > .rbc-events-container').click();
    // Title
    cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type(
      'This is a test event'
    );
    // Location
    cy.get(':nth-child(4) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type(
      'The location is on zoom'
    );
    // Description
    cy.get(':nth-child(5) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type(
      'This is a description 2'
    );

    cy.get('#selectEmployee').type('employee');
    cy.get('#selectEmployee').type('{downarrow}{enter}');

    cy.get(':nth-child(7) > .MuiButtonBase-root > .MuiButton-label').click();
    cy.wait('@createEventAPI').its('response.statusCode').should('eq', 201);
  });
});
