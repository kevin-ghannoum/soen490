/// <reference types="cypress" />

import { getEventsDataIntercept } from '../helpers/eventScheduleIntercept';
import { getAllNotificationsByCurrentUser } from '../helpers/notificationIntercept';
import { loginIntercept } from '../helpers/loginIntercept';
import { getExpensesForBusiness } from '../helpers/transactionIntercept';

describe('ViewRoot feature e2e test', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should view root page calendar, notification grid and expenses chart', () => {
    cy.wait(500);
    getEventsDataIntercept();
    getExpensesForBusiness();
    getAllNotificationsByCurrentUser();
    
    cy.visit('/');
    cy.get('.rbc-calendar').should('exist');
    cy.get('.MuiDataGrid-root').should('exist');
    cy.get('.MuiDataGrid-cell').should('exist');
  });
});
