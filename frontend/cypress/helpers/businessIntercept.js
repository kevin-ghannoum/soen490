/// <reference types="cypress" />

export const getAllBusinessesIntercept = () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/businesses',
      },
      { fixture: 'allBusinesses.json', statusCode: 200 }
    ).as('getListOfBusinessesAPI');
  };
  
  export const updateBusinessIntercept = () => {
    cy.intercept(
      {
        method: 'PUT',
        url: '/business/1',
      },
      { statusCode: 200 }
    ).as('editBusinessAPI');
  };
  
  export const getBusinessByIdIntercept = () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/business/1',
      },
      { fixture: 'business.json', statusCode: 200 }
    ).as('getBusinessAPI');
  };
  
  export const deletebusinessIntercept = () => {
    cy.intercept(
      {
        method: 'DELETE',
        url: '/business/1',
      },
      { statusCode: 200 }
    ).as('deleteBusinessAPI');
  };
  