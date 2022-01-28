/// <reference types="cypress" />

export const getCallsFromCallerIntercept = () => {
  let interceptCount = 0;

    cy.intercept('GET', '/calls/*', (req) => {
      req.reply((res) => {
        if (interceptCount === 0) {
          interceptCount += 1;
          res.send({ fixture: 'callList.json', statusCode: 200 });
        } else {
          res.send({ fixture: 'createCallList.json', statusCode: 200 });
        }
      });
    }).as('getCallLogAPI');
};