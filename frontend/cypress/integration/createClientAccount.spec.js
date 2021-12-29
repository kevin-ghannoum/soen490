/// <reference types="cypress" />

import { loginIntercept} from '../helpers/loginIntercept';
import { userPersonalInfo, userAddressInfo, userBusinessInfo } from '../helpers/userCreation';

describe('CreateClientAccount feature e2e test', () => {
  beforeEach(() => {
    loginIntercept()
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  const getClientAccount = () => {
    userPersonalInfo();
    userAddressInfo();
    userBusinessInfo();
  }

  // Test user story: #32 As a business user, I want to create a client account
  it('Should create a new client account', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/accounts/client',
      },
      { fixture: 'createClientAccount.json', statusCode: 201 }
    ).as('createClientAccountAPI');
    
    cy.visit('/clientAccount/new');

    getClientAccount();

    cy.get('input[name=status]').parent().type('Scheduled{enter}');

    cy.get('form').submit();
    cy.wait('@createClientAccountAPI').its('response.statusCode').should('eq', 201);
    cy.contains('Created succesfully');
  });

  it('should render', () => {
    cy.visit('/clientAccount/new');
    cy.get('#CreateClientAccount-Grid').should('exist');
  });
});
