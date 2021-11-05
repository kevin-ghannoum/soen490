/// <reference types="cypress" />

describe('CreateBusinessAccount feature e2e test', () => {
  const firstName = 'John';
  const lastName = 'Doe';
  const username = 'JohnUsername';
  const password = 'Password123';
  const email = 'johndoe@gmail.com';
  const phone = '5145555555';

  const title = 'Junior';
  const hourlyWage = '25';
  const supervisorEmail = 'johndoe@gmail.com';

  const civicNumber = '111';
  const streetName = 'my street';
  const cityName = 'Montreal';
  const province = 'QC';
  const postalCode = 'H6T0R5';
  const country = 'Canada';

  beforeEach(() => {
    cy.visit('/');
  });

  // Test user story: #26 As an admin, I want to create new account for employee
  it('Should create a new employee account', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/accounts/employee',
      },
      { fixture: 'createEmployeeAccount.json', statusCode: 201 }
    ).as('createEmployeeAccountAPI');

    cy.visit('/employeeAccount/new');

    cy.get('input[name=firstName]').type(firstName);
    cy.get('input[name=lastName]').type(lastName);
    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('input[name=email]').type(email);
    cy.get('input[name=phone]').type(phone);

    cy.get('input[name=title]').type(title);
    cy.get('input[name=hourlyWage]').type(hourlyWage);
    cy.get('input[name=supervisorEmail]').type(supervisorEmail);

    cy.get('input[name=civicNumber]').type(civicNumber);
    cy.get('input[name=streetName').type(streetName);
    cy.get('input[name=cityName]').type(cityName);
    cy.get('input[name=province]').type(province);
    cy.get('input[name=postalCode]').type(postalCode);
    cy.get('input[name=country]').type(country);

    cy.get('form').submit();
    cy.wait('@createEmployeeAccountAPI').its('response.statusCode').should('eq', 201);
    cy.contains('Created succesfully');
  });

  it('should render', () => {
    cy.visit('/employeeAccount/new');
    cy.get('#CreateEmployeeAccount-Grid').should('exist');
  });
});
