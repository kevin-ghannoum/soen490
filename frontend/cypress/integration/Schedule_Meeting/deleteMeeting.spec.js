/// <reference types="cypress" />
import {
  deleteSingleEventDataIntercept,
  getSingleEventsDataAfterDeleteIntercept,
  getSingleEventsDataIntercept,
  updateEventIntercept,
} from '../../helpers/eventScheduleIntercept';
import { loginIntercept } from '../../helpers/loginIntercept';

describe('delete a meeting', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('should delete a meeting', () => {
    getSingleEventsDataIntercept();
    updateEventIntercept();
    deleteSingleEventDataIntercept();
    cy.visit('/calendar');
    cy.get('.rbc-event-content').click();
    cy.get(':nth-child(7) > [type="button"] > .MuiButton-label').click();
    getSingleEventsDataAfterDeleteIntercept();
    cy.get('.MuiDialogActions-root > .MuiButton-contained > .MuiButton-label').click();
    cy.wait('@getDeletedEventAPI').its('response.statusCode').should('eq', 200);
  });
});
