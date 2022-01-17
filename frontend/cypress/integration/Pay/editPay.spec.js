/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';
import { updatePayIntercept, getPayByIdIntercept } from '../../helpers/payIntercept';

describe('EditProject feature e2e test', () => {
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

  it('Should edit a project project', () => {
    updatePayIntercept();
    getPayByIdIntercept();

    cy.visit('/pay/edit/1');
    cy.get('#EditPay-Grid').should('exist');
    
    cy.get('input[name=startDate]').type(startDate);
    cy.get('input[name=endDate]').type(endDate);
    cy.get('input[name=hoursWorked]').type(hoursWorked);
    cy.get('input[name=paidAmount]').type(paidAmount);

    cy.get('form').submit();
    cy.wait('@editPayAPI').its('response.statusCode').should('eq', 200);
    cy.contains('Saved succesfully');

  });
});
