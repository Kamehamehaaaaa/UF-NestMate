/* eslint-disable no-undef */
describe('Matching based on Roomate Preference Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });

    it('Should navigate to Roomate Matching page when Matches button is clicked', () => {
        cy.get('header').contains('Match').click();
        cy.url().should('include', '/matches');
      });
  
    it('Should show matches based on roomate preference', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').should('be.visible').type('a@gmail.com');
        cy.get('.login-popup input[type="password"]').should('be.visible').type('a');
        cy.get('.login-popup button[type="submit"]').click();

        cy.get('header').contains('Match').click();
        cy.url().should('include', '/matches');
        cy.get('.clickable-card').first().click();
    });

    it('Should display "No matches found" if user is not logged in', () => {
        cy.get('header').contains('Match').click();
        cy.contains('No matches found').should('exist');
    });

    it('Should display "No matches found" if user has no matches', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').should('be.visible').type('h@gmail.com');
        cy.get('.login-popup input[type="password"]').should('be.visible').type('h');
        cy.get('.login-popup button[type="submit"]').click();

        cy.get('header').contains('Match').click();
        cy.contains('No matches found').should('exist');
    });

    it('Should display first name, last name, major, and budget on the user card', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').should('be.visible').type('a@gmail.com');
        cy.get('.login-popup input[type="password"]').should('be.visible').type('a');
        cy.get('.login-popup button[type="submit"]').click();
      
        cy.get('header').contains('Match').click();
        cy.get('.clickable-card').should('contain.text', 'Major');
        cy.get('.clickable-card').should('contain.text', 'Budget');
    });  

    it('Should open modal and show profile info when a match card is clicked', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').should('be.visible').type('a@gmail.com');
        cy.get('.login-popup input[type="password"]').should('be.visible').type('a');
        cy.get('.login-popup button[type="submit"]').click();
        cy.get('header').contains('Match').click();
      
        cy.get('.clickable-card').first().click();
        cy.get('.housing-modal').should('be.visible');
        cy.contains("Profile").should('exist');
        cy.contains("Basic Info").should('exist');
        cy.contains("Personal Details").should('exist');
        cy.contains('Name').should('exist');
        cy.contains('Major').should('exist');
    });

    it('Should switch tabs in modal to Preferences', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').should('be.visible').type('a@gmail.com');
        cy.get('.login-popup input[type="password"]').should('be.visible').type('a');
        cy.get('.login-popup button[type="submit"]').click();

        cy.get('header').contains('Match').click();
        cy.get('.clickable-card').first().click();
        cy.get('.housing-modal').should('be.visible');
      
        cy.contains('Preferences').click();
        cy.contains('Living Preferences').should('exist');
        cy.contains('Budget Range').should('exist');
        cy.contains('Smoking/Drinking').should('exist');
        cy.contains('Sleeping Habit').should('exist');
        cy.contains('Cleanliness Level').should('exist');
        cy.contains('Gender Preference').should('exist');
        cy.contains('Pet Preference').should('exist');
    });  
    
    it('Should fallback to default image if profile picture fails to load', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').should('be.visible').type('l@gmail.com');
        cy.get('.login-popup input[type="password"]').should('be.visible').type('l');
        cy.get('.login-popup button[type="submit"]').click();
        
        cy.get('header').contains('Match').click();
        cy.get('.clickable-card img').first().should('have.attr', 'src').then(src => {
          cy.get('.clickable-card img').first().invoke('attr', 'src', '/empty.png');
        });
    });
      
    it('Should close modal when close button is clicked', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').should('be.visible').type('l@gmail.com');
        cy.get('.login-popup input[type="password"]').should('be.visible').type('l');
        cy.get('.login-popup button[type="submit"]').click();
        
        cy.get('header').contains('Match').click();
        cy.get('.clickable-card').first().click();
        cy.get('.housing-modal').should('exist');
      
        cy.get('.housing-modal .btn-close').click();
        cy.get('.housing-modal').should('not.exist');
    });
      
      
}); 