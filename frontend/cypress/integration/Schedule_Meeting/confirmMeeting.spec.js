/// <reference types="cypress" />

describe('confirm a meeting', () => {
  it('should confirm a meeting', () => {
    cy.visit('/event/invitation/status?id=1&accepted=true&email=employee@employee.com');
    cy.intercept(
      {
        method: 'POST',
        url: '/event/1/accept?email=employee@employee.com&accepted=true',
      },
      {
        statusCode: 200,
        times: 1,
      }
    );
  });
});
