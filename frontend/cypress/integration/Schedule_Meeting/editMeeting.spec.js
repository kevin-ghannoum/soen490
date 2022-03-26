/// <reference types="cypress" />
import { getSingleEventsDataIntercept, updateEventIntercept } from '../../helpers/eventScheduleIntercept';
import { loginIntercept } from '../../helpers/loginIntercept';

describe('update a meeting', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('should update a meeting', () => {
    getSingleEventsDataIntercept();
    updateEventIntercept();
    cy.visit('/calendar');
    cy.get('.rbc-event-content').click();
    cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').type(' adding text');
    cy.get(':nth-child(7) > .MuiButton-containedPrimary > .MuiButton-label').click();
    cy.wait('@updateEventAPI').its('response.statusCode').should('eq', 200);
  });
});
