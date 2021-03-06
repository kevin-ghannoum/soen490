/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';
import { createLogHoursIntercept, getAllEmployeesByBusinessIntercept,getInputTypeByEmail, getLatestPayByEmail } from '../../helpers/payIntercept';

describe('LogHour feature e2e test', () => {
  const employee = 'employee';
  const startDate = '2021-10-22';
  const endDate = '2021-10-25';
  const hoursWorked = '40';
  const paidAmount = '500';

  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  // Test user story: #31. As a business user, I want to log hours
  it('Should log hours for one employee', () => {
    createLogHoursIntercept();
    getAllEmployeesByBusinessIntercept();
    getInputTypeByEmail();
    getLatestPayByEmail();

    cy.visit('/pay/new');

    cy.get('input[name=email]').type(employee + '{downarrow}{enter}');
    cy.get('input[name=startDate]').type(startDate);
    cy.get('input[name=endDate]').type(endDate);
    cy.get('input[name=hoursWorked]').type(hoursWorked);
    cy.get('input[name=paidAmount]').type(paidAmount);

    cy.get('form').submit();
    cy.wait('@logHoursAPI').its('response.statusCode').should('eq', 201);
    cy.contains('Created succesfully');

    it('should render', () => {
      cy.visit('/employees');
      cy.get('#LogHours-Grid').should('exist');
    });
  });
});
