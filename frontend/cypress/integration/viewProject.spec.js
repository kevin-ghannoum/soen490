/// <reference types="cypress" />

import { loginIntercept} from '../helper/loginIntercept';
describe('twst',()=>{
  beforeEach(() => {
  loginIntercept()
});

afterEach(() => {
  cy.clearLocalStorage();
});
  
it('Should view a list of project', () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/project?businessId=*',
    },
    { fixture: 'projectList.json', statusCode: 200 }
  ).as('getListOfPorjectAPI');

  cy.visit('/projects');
  cy.get("#View-Project-Grid").should('exist');
});
})

  