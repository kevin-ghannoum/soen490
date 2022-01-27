/// <reference types="cypress" />

export const getCallsFromCallerIntercept = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/calls/*',
    },
    { fixture: 'callList.json', statusCode: 200 }
  ).as('getListOfCallAPI');
};
