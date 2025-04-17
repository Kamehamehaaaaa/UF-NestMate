/* eslint-disable no-undef */
describe('Apartment Finder App', () => {
    beforeEach(() => {
      cy.intercept('GET', 'http://localhost:8080/api/housing/getAll').as('getHousingData');
      cy.visit('/');
    });
  
    it('should load the header and main sections correctly', () => {
      cy.get('header').should('exist');
      cy.get('.roommate').should('contain', 'Apartment');
    });
  
    it('should fetch and display housing data on load', () => {
      cy.wait('@getHousingData');
    });
      
  
    it('should filter apartments by name when searched', () => {
      cy.get('.search-input').type('HideAway');
      cy.get('.search-button').click();
      cy.get('.clickable-card').first().click();
      cy.contains('HideAway').should('exist');
    });
      
  
    it('should fetch and filter by rating when selected', () => {
      cy.intercept('GET', 'http://localhost:8080/api/filter/ratings').as('getByRating');
      cy.get('.filter-button').click();
      cy.get('.dropdown-menu').contains('Rating').click();
      cy.get('.search-button').click();
      cy.wait('@getByRating');
    });
  
    it('should fetch and sort apartments by location (university)', () => {
      cy.intercept('GET', 'http://localhost:8080/apt/housing/sortByDistance?university=University%20of%20Florida').as('getByLocation');
      cy.get('.filter-button').click();
      cy.get('.dropdown-menu').contains('Location (University)').click();
      cy.get('.search-input').type('University of Florida');
      cy.get('.search-button').click();
      cy.wait('@getByLocation'); 
    });
  
    it('should scroll to the contact section when clicking contact', () => {
      cy.get('header').contains('Contact').click();
      cy.get('.contact-section').should('be.visible');
    });
  });  