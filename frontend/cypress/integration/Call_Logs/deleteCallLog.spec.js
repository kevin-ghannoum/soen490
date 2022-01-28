/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';

describe('CreateCallLogs feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should create a new call log', () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/accounts/client?email=*',
      },
      { fixture: 'clientList.json', statusCode: 200 }
    ).as('getClientAPI');

    cy.intercept(
      {
        method: 'DELETE',
        url: '/call/*',
      },
      { fixture: 'callList.json', statusCode: 200 }
    ).as('deleteCallLogAPI');

    let interceptCount = 0;

    cy.intercept('GET', '/calls/*', (req) => {
      req.reply((res) => {
        if (interceptCount === 0) {
          interceptCount += 1;
          res.send({ fixture: 'createCallList.json', statusCode: 200 });
        } else {
          res.send({ fixture: 'callList.json', statusCode: 200 });
        }
      });
    });

    cy.visit('/logs');

    cy.get('.Mui-odd > [data-field="delete"] > .MuiButtonBase-root > .MuiButton-label').click();

    cy.get('.MuiDialogActions-root > .MuiButton-contained').click();

    cy.wait('@deleteCallLogAPI').its('response.statusCode').should('eq', 200);
  });
});
