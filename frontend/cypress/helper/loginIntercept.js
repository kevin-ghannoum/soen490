/// <reference types="cypress" />

export const loginIntercept = () => {
  cy.intercept(
    {
      method: 'POST',
      url: '/auth/login',
    },
    {
      fixture: 'loginResponse.json',
      statusCode: 202,
    }
  ).as('loginAPI');

  cy.intercept(
    {
      method: 'GET',
      url: '/redux/accounts',
    },
    { fixture: 'adminAccount.json', statusCode: 200 }
  ).as('getReduxAccounts');

  cy.intercept(
    {
      method: 'POST',
      url: '/auth/refreshTokens',
    },
    {
      fixture: 'loginResponse.json',
      statusCode: 202,
    }
  ).as('refreshToken');

  cy.visit('/login');
  const email = 'admin@admin.com';
  const password = 'Soen490!';
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);

  cy.get('form').submit();
};
