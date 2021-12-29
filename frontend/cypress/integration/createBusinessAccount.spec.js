/// <reference types="cypress" />

import { loginIntercept} from '../helpers/loginIntercept';
import { userPersonalInfo, userAddressInfo, userBusinessInfo } from '../helpers/userCreation';

describe('CreateBusinessAccount feature e2e test', () => {
  beforeEach(() => {
    loginIntercept()
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  // Test user story: #25 As an admin, I want to create new account for business
  it('Should create a new business account', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/accounts/business',
      },
      { fixture: 'createBusinessAccount.json', statusCode: 201 }
    ).as('createBusinessAccountAPI');
    
    cy.visit('/businessAccount/new');

    userPersonalInfo();
    userAddressInfo();
    userBusinessInfo();

    cy.get('form').submit();
    cy.wait('@createBusinessAccountAPI').its('response.statusCode').should('eq', 201);
    cy.contains('Created succesfully');
  });

  it('should render', () => {
    cy.visit('/businessAccount/new');
    cy.get('#CreateBusinessAccount-Grid').should('exist');
  });
});
