/// <reference types="cypress" />

export const getProjectFromBusinessIntercept = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/project?businessId=*',
    },
    { fixture: 'projectList.json', statusCode: 200 }
  ).as('getListOfProjectAPI');
};

export const getEmployeeEmailProjectIntercept = () => {
  cy.intercept(
    {
      method: 'GET',
      url: '/accounts/employee?email=*',
    },
    { fixture: 'employeeList.json', statusCode: 200 }
  ).as('getClientAPI');
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
