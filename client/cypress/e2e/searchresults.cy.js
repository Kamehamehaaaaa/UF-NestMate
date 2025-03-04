/* eslint-disable no-undef */

describe('Apartment Search Results', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
        if (err.message.includes('Cannot read properties of undefined')) {
          return false;  
        }
        return true;
      });

    beforeEach(() => {
      cy.visit('http://localhost:3000/'); 
    });
  
    it('Displays apartment cards', () => {
      cy.get('.clickable-card').should('have.length.greaterThan', 0);
    });
  
    it('Opens the modal on clicking a card', () => {
      cy.get('.clickable-card').first().click();
      cy.get('.apartment-modal').should('be.visible');
    });
  
    it('Closes the modal', () => {
      cy.get('.clickable-card').first().click();
      cy.get('.modal-footer button').contains('Close').click();
      cy.get('.apartment-modal').should('not.exist');
    });

    it('Clicks the Login button', () => {
      cy.get('.login-btn').click();         
    });
    
    it('Clicks the Contact button', () => {
      cy.get('a[href="contact"]').click();
    });
      
    
    it('Clicks the Search Apartment button', () => {
      cy.get('.search-button').click();
    });
  });  