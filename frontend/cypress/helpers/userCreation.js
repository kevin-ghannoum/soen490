/// <reference types="cypress" />

import { accountFixture } from '../fixtures/accountFixture'

export const userPersonalInfo = () => {
    cy.get('input[name=firstName]').type(accountFixture.firstName);
    cy.get('input[name=lastName]').type(accountFixture.lastName);
    cy.get('input[name=username]').type(accountFixture.username);
    cy.get('input[name=password]').type(accountFixture.password);
    cy.get('input[name=email]').type(accountFixture.email);
    cy.get('input[name=phone]').type(accountFixture.phone);
}

export const userAddressInfo = () => {
    cy.get('input[name=civicNumber]').type(accountFixture.civicNumber);
    cy.get('input[name=streetName').type(accountFixture.streetName);
    cy.get('input[name=cityName]').type(accountFixture.cityName);
    cy.get('input[name=province]').type(accountFixture.province);
    cy.get('input[name=postalCode]').type(accountFixture.postalCode);
    cy.get('input[name=country]').type(accountFixture.country);
}

export const userBusinessInfo = () => {
    cy.get('input[name=industry]').type(accountFixture.industry);
    cy.get('input[name=socialMediaName').type(accountFixture.socialMediaName);
    cy.get('input[name=socialMediaLink').type(accountFixture.socialMediaLink);
    cy.get('input[name=website]').type(accountFixture.website);
}