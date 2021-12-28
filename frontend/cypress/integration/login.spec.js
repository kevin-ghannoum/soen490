/// <reference types="cypress" />

describe('Login feature e2e test', () => {
  const email = 'john@gmail.com';
  const password = 'Password123!';

  beforeEach(() => {
    cy.visit("/")
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  // Test user story: #24 As a user, I want to login
  it('Should login with a business account', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/auth/login',
      },
      {
        fixture: 'loginResponse.json',
        statusCode: 202,
      }
    ).as("loginAPI");

    cy.intercept(
      {
        method: 'GET',
        url: '/redux/accounts/',
      },
      {
        fixture: 'getAccountRedux.json',
        statusCode: 200,
      }
    ).as("getAccountReduxAPI");

    cy.visit('/login');

    cy.get('input[name=email]').type(email);

    cy.get('input[name=password]').type(password);

    cy.get('form').submit();

    cy.wait('@loginAPI').its('response.statusCode').should('eq', 202)

    cy.wait('@getAccountReduxAPI').its('response.statusCode').should('eq', 200).and(()=>{
        expect(localStorage.getItem("access_token")).to.eq('xxxxxxxxxxxxxxxxxxxxx')
        expect(localStorage.getItem("id_token")).to.eq('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        expect(localStorage.getItem("refresh_token")).to.eq('xxxxxxxxx')
    })
  });
});
