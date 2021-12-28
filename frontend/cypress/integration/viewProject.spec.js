/// <reference types="cypress" />

<<<<<<< HEAD
import { loginIntercept } from '../helpers/loginIntercept';

describe('ViewProject feature e2e test',()=>{
  beforeEach(() => {
    loginIntercept()
  });
=======
import { loginIntercept} from '../helper/loginIntercept';
describe('twst',()=>{
  beforeEach(() => {
  loginIntercept()
});
>>>>>>> 7aa1315 (test fix)

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

  