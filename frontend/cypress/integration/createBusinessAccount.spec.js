/// <reference types="cypress" />

describe('CreateBusinessAccount feature e2e test', () => {
  const firstName = 'John';
  const lastName = 'Doe';
  const username = 'JohnUsername';
  const password = 'Password123';
  const email = 'johndoe@gmail.com';
  const phone = '5145555555';
  const civicNumber = '111';
  const streetName = 'my street';
  const cityName = 'Montreal';
  const province = 'QC';
  const postalCode = 'H6T0R5';
  const country = 'Canada';
  const businessName = 'John Store';
  const industry = 'Clothing';
  const socialMediaName = 'John Social';
  const socialMediaLink = 'instagram.com/john';
  const website = 'john.com';

  beforeEach(() => {
    cy.visit('/');
  });

  // Test user story: As an admin, I want to create new account for business
  it('Should create a new business account', () => {
    cy.intercept(
      {
        method: 'POST',
        url: '/accounts/business',
      },
      { fixture: 'createBusinessAccount.json', statusCode: 201 }
    ).as('createBusinessAccountAPI');
    
    cy.visit('/businessAccount/new');

    cy.get('input[name=firstName]').type(firstName);
    cy.get('input[name=lastName]').type(lastName);
    cy.get('input[name=username]').type(username);
    cy.get('input[name=password]').type(password);
    cy.get('input[name=email]').type(email);
    cy.get('input[name=phone]').type(phone);
    cy.get('input[name=civicNumber]').type(civicNumber);
    cy.get('input[name=streetName').type(streetName);
    cy.get('input[name=cityName]').type(cityName);
    cy.get('input[name=province]').type(province);
    cy.get('input[name=postalCode]').type(postalCode);
    cy.get('input[name=country]').type(country);
    cy.get('input[name=name]').type(businessName);
    cy.get('input[name=industry]').type(industry);
    cy.get('input[name=socialMediaName').type(socialMediaName);
    cy.get('input[name=socialMediaLink').type(socialMediaLink);
    cy.get('input[name=website]').type(website);

    cy.get('form').submit();
    cy.wait('@createBusinessAccountAPI').its('response.statusCode').should('eq', 201);
    cy.contains('Created succesfully');
  });

  it('should render', () => {
    cy.visit('/businessAccount/new');
    cy.get('#CreateBusinessAccount-Grid').should('exist');
  });
});