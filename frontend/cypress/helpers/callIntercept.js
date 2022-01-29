/// <reference types="cypress" />

export const getCallsFromCallerIntercept = (getter) => {
  let interceptCount = 0;

  if (getter === 'delete') {
    interceptCount = 1;
  }

  cy.intercept('GET', '/calls/*', (req) => {
    req.reply((res) => {
      if (interceptCount === 0) {
        res.send({ fixture: 'callList.json', statusCode: 200 });
        if (getter === 'edit') {
          interceptCount = 2;
        } else {
          interceptCount = 1;
        }
      } else if (interceptCount === 1) {
        res.send({ fixture: 'createCallList.json', statusCode: 200 });
        interceptCount = 0;
      } else {
        res.send({ fixture: 'editCallList.json', statusCode: 200 });
        interceptCount = 0;
      }
    });
  }).as('getCallLogAPI');
};
