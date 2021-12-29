/// <reference types="cypress" />

import { loginIntercept} from '../helpers/loginIntercept';
import { userPersonalInfo, userAddressInfo } from '../helpers/userCreation';

describe('CreateEmployeeAccount feature e2e test', () => {
  const title = 'Junior';
  const hourlyWage = '25';
  const supervisorEmail = 'johndoe@gmail.com';
  
  beforeEach(() => {
    loginIntercept()
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  // Test user story: #26 As an admin, I want to create new account for employee
  it('Should create a new employee account', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/accounts/employee',
      },
      { fixture: 'createEmployeeAccount.json', statusCode: 201 }
    ).as('createEmployeeAccountAPI');

    cy.visit('/employeeAccount/new');

    userPersonalInfo();

    cy.get('input[name=title]').type(title);
    cy.get('input[name=hourlyWage]').type(hourlyWage);
    cy.get('input[name=supervisorEmail]').type(supervisorEmail);

    userAddressInfo();

    cy.get('form').submit();
    cy.wait('@createEmployeeAccountAPI').its('response.statusCode').should('eq', 201);
    cy.contains('Created succesfully');
  });

  it('should render', () => {
    cy.visit('/employeeAccount/new');
    cy.get('#CreateEmployeeAccount-Grid').should('exist');
  });
});
