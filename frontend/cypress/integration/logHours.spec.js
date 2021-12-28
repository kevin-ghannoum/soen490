/// <reference types="cypress" />

import { loginIntercept} from '../helper/loginIntercept';

describe('CreateBusinessAccount feature e2e test', () => {
    const email = 'employee@gmail.com';
    const startDate = '2021-10-22';
    const endDate = '2021-10-25';
    const hoursWorked = '40';
    const paidAmount = '500';

    beforeEach(() => {
      loginIntercept()
    });

    afterEach(() => {
      cy.clearLocalStorage();
    });
  
    // Test user story: #31. As a business user, I want to log hours
    it('Should log hours for one employee', () => {
      cy.intercept(
        {
          method: 'POST',
          url: '/logHours',
        },
        { fixture: 'pay.json', statusCode: 201 }
      ).as('logHoursAPI');

      cy.intercept('GET', '/accounts/allEmployees', (req) => {
          req.reply({
              statusCode: 200,
              fixture: 'allEmployees.json'
          })
      })

      cy.intercept('GET', '/logHours/inputType/employee@gmail.com', (req) => {
          req.reply({
              statusCode: 200,
              fixture: 'emptyInputType.json'
          })
      })

      cy.intercept('GET', '/logHours/pay/latest/employee@gmail.com', (req) => {
          req.reply({
              statusCode: 200,
              fixture: 'emptyLatestPay.json'
          })
      })
  
      cy.visit('/employees');
  
      cy.get('input[name=email]').type(email + '{downarrow}{enter}');
      cy.get('input[name=startDate]').type(startDate);
      cy.get('input[name=endDate]').type(endDate);
      cy.get('input[name=hoursWorked]').type(hoursWorked);
      cy.get('input[name=paidAmount]').type(paidAmount);
  
      cy.get('form').submit();
      cy.wait('@logHoursAPI').its('response.statusCode').should('eq', 201);
      cy.contains('Created succesfully');
  
      it('should render', () => {
        cy.visit('/employees');
        cy.get('#LogHours-Grid').should('exist');
      });
    });
  });
  