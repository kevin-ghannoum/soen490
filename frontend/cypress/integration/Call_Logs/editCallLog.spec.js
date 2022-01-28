/// <reference types="cypress" />

import { loginIntercept } from '../../helpers/loginIntercept';
import { getClientEmailProjectIntercept } from '../../helpers/projectIntercept';

describe('editCall feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should edit a call log', () => {
    getClientEmailProjectIntercept();

    cy.intercept(
      {
        method: 'PUT',
        url: '/call/*',
      },
      { fixture: 'editCallList.json', statusCode: 201 }
    ).as('editCallLogAPI');

    let interceptCount = 0;

    cy.intercept('GET', '/calls/*', (req) => {
      req.reply((res) => {
        if (interceptCount === 0) {
          interceptCount += 1;
          res.send({ fixture: 'callList.json', statusCode: 200 });
        } else {
          res.send({ fixture: 'editCallList.json', statusCode: 200 });
        }
      });
    }).as('getCallLogAPI');

    cy.visit('/logs');

    cy.wait('@getCallLogAPI');

    cy.get('[data-field="edit"] > .MuiButtonBase-root > .MuiButton-label').click();

    cy.get('#selectClient').type('a@a.com');
    cy.get('#selectClient').type('{downarrow}{enter}');

    cy.get('#lock-button').click();
    cy.contains('Email sent').click();

    cy.get('#outlined-textarea').clear();
    cy.get('#outlined-textarea').type('This is an edit');

    cy.get('#editLog').click();

    cy.wait('@editCallLogAPI').its('response.statusCode').should('eq', 201);
  });
});
