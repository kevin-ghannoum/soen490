/// <reference types="cypress" />
import { getSingleEventsDataIntercept } from '../../helpers/eventScheduleIntercept';
import { loginIntercept } from '../../helpers/loginIntercept';

describe('view a meeting', () => {
  beforeEach(() => {
    loginIntercept();
  });

  afterEach(() => {
    cy.clearLocalStorage();
  });

  it('Should create a meeting', () => {
    getSingleEventsDataIntercept();
    cy.visit('/calendar');
    cy.get('.rbc-event-content').click();
    cy.get(':nth-child(2) > .MuiFormControl-root > .MuiInputBase-root > .MuiInputBase-input').contains('Test event');
  });
});
