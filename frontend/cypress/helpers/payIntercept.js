/// <reference types="cypress" />

export const getAllBusinessPaysIntercept = () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/logHours?businessId=*',
      },
      { fixture: 'businessPays.json', statusCode: 200 }
    ).as('getListOfPaysAPI');
  };
  
  export const updatePayIntercept = () => {
    cy.intercept(
      {
        method: 'PUT',
        url: '/logHours/pay/1',
      },
      { fixture: 'payUpdate.json', statusCode: 200 }
    ).as('editPayAPI');
  };
  
  export const getPayByIdIntercept = () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/logHours/pay/1',
      },
      { fixture: 'pay.json', statusCode: 200 }
    ).as('getPayAPI');
  };
  
  
  
  export const getClientEmailProjectIntercept = () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/accounts/client?email=*',
      },
      { fixture: 'clientList.json', statusCode: 200 }
    ).as('getClientAPI');
  };
  
  export const updateProjectIntercept = () => {
    cy.intercept(
      {
        method: 'PUT',
        url: '/project/11',
      },
      { fixture: 'projectList.json', statusCode: 200 }
    ).as('updateProjectAPI');
  };
  
  export const getProjectIntercept = () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/project/11',
      },
      { fixture: 'getSingleProject.json', statusCode: 200, times: 1 }
    ).as('getProjectAPI');
  };
  