/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';
import { getClientEmailProjectIntercept } from '../../helpers/projectIntercept';

describe('DeleteCallLogs feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should delete a new call log', () => {
    getClientEmailProjectIntercept();

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
    }).as('getCallLogAPI');

    cy.visit('/logs');

    cy.wait('@getCallLogAPI');

    cy.get('.Mui-odd > [data-field="delete"] > .MuiButtonBase-root > .MuiButton-label').click();

    cy.get('.MuiDialogActions-root > .MuiButton-contained').click();

    cy.wait('@deleteCallLogAPI').its('response.statusCode').should('eq', 200);
  });
});
