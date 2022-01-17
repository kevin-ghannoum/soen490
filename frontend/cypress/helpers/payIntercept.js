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
  
  export const createLogHoursIntercept = () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/logHours',
      },
      { fixture: 'pay.json', statusCode: 201 }
    ).as('logHoursAPI');
  };
  
  export const getAllEmployeesByBusinessIntercept = () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/accounts/allEmployees/admin@admin.com',
      },
      { fixture: 'allEmployees.json', statusCode: 200 }
    ).as('getAllBusinessEmployeesAPI');
  };

  export const getInputTypeByEmail = () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/logHours/inputType/employee@employee.com',
      },
      { fixture: 'emptyInputType.json', statusCode: 200 }
    ).as('getInputTypeByEmailAPI');
  };

  export const getLatestPayByEmail = () => {
    cy.intercept(
      {
        method: 'GET',
        url: '/logHours/pay/latest/employee@employee.com',
      },
      { fixture: 'emptyLatestPay.json', statusCode: 200 }
    ).as('getLatestPayByEmailAPI');
  };
  