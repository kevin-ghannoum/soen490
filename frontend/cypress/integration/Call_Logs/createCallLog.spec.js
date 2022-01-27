// for next time:
// - open a terminal in the BE and run npm install and npm run dev
// - open a terminal in the FE and run npm install and npm run start-dev
// - to open cypress: cd in the frontend and npx cypress open

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
        method: 'POST',
        url: '/call',
      },
      { fixture: 'callList.json', statusCode: 201 }
    ).as('createCallLogAPI');

    let interceptCount = 0;

    cy.intercept('GET', '/calls/*', (req) => {
      req.reply((res) => {
        if (interceptCount === 0) {
          interceptCount += 1;
          res.send({ fixture: 'callList.json', statusCode: 200 });
        } else {
          res.send({ fixture: 'newCallList.json', statusCode: 200 });
        }
      });
    });

    cy.visit('/logs');

    cy.get('#addLog').click();

    cy.get('#selectClient').type('a@a.com');
    cy.get('#selectClient').type('{downarrow}{enter}');

    cy.get('#lock-button').click();
    cy.contains('Left Voicemail').click();

    cy.get('#outlined-textarea').type('This is a test');

    cy.get('#createLog').click();

    cy.wait('@createCallLogAPI').its('response.statusCode').should('eq', 201);
  });
});
