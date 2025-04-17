/* eslint-disable no-undef */
describe('Profile Page Tests', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').should('be.visible').type('a@gmail.com');
        cy.get('.login-popup input[type="password"]').should('be.visible').type('a');
        cy.get('.login-popup button[type="submit"]').click();
    });
  
    it('Should display profile info by default', () => {
        cy.get('.profile-avatar').click();
        cy.contains('My Profile').should('have.class', 'active');
        cy.contains('First Name:').next().should('contain', 'a');
        cy.contains('Last Name:').next().should('contain', 'a');
        cy.contains("Favorite Apartments").should('exist');
        cy.contains("Edit Profile").should('exist');
        cy.contains("Logout").should('exist');
    });
  
    it('Should switch to preferences tab and load data', () => {
        cy.get('.profile-avatar').click();
        cy.contains('Roommate Preferences').click();
        cy.contains('Roommate Preferences').should('have.class', 'active');
        cy.contains('Monthly Budget Range ($)').should('exist');
        cy.contains('Major').should('exist');
        cy.contains('Hobbies').should('exist');
        cy.contains('Food Preference').should('exist');
        cy.contains('Sleeping Habit').should('exist');
        cy.contains('Smoking / Drinking').should('exist');
        cy.contains('Cleanliness Preference').should('exist');
        cy.contains('Gender Preference').should('exist');
        cy.contains('Pet Preference').should('exist');
        cy.contains('Save Preferences').should('exist');
    });

    it('Should load the form with default or pre-filled values for new users', () => {
        cy.get('.profile-avatar').click();
        cy.contains('Logout').click();
 
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').should('be.visible').type('wh@gmail.com');
        cy.get('.login-popup input[type="password"]').should('be.visible').type('w');
        cy.get('.login-popup button[type="submit"]').click();

        cy.get('.profile-avatar').click();
        cy.contains('Roommate Preferences').click();
      
        cy.get('input[placeholder="Minimum"]').should('have.value', '0');
        cy.get('input[placeholder="Maximum"]').should('have.value', '1000');
        cy.get('select').eq(0).should('have.value', 'any'); 
        cy.get('select').eq(1).should('have.value', 'any'); 
        cy.get('input[type="range"]').should('have.value', '3');
        cy.get('input[name="smoking"][value="no"]').should('be.checked');
        cy.get('input[name="gender_preference"][value="any"]').should('be.checked');
        cy.get('select').eq(2).should('have.value', 'fine with pets');
    });
      

    it('Should edit preferences and show success message', () => {
        cy.get('.profile-avatar').click();
        cy.contains('Roommate Preferences').click();
      
        cy.get('input[placeholder="Minimum"]').clear().type('0');
        cy.get('input[placeholder="Maximum"]').clear().type('1000');
        cy.get('input[placeholder="Enter your major"]').clear().type('Computer Science');
        cy.get('input[placeholder="Enter your hobbies"]').clear().type('Basketball');
        cy.get('select').eq(0).select('vegetarian');
        cy.get('select').eq(1).select('late sleeper');
        cy.get('input[name="smoking"][value="yes"]').check({ force: true });
        cy.get('input[type="range"]').invoke('val', 3).trigger('input');
        cy.get('input[name="gender_preference"][value="female"]').check({ force: true });
        cy.get('select').eq(2).select('not fine with pets');
        cy.contains('Save Preferences').click();
    });
      
  
    it('Should open and close apartment modal', () => {
        cy.get('.profile-avatar').click();
        cy.contains('Favorite Apartments');
        cy.get('.favorite-item').first().click();
        cy.contains('Location:').should('exist');
        cy.get('.back-btn').click();
        cy.get('.apartment-modal-overlay').should('not.exist');
    });
  
    it('Should enter edit mode and change name', () => {
        cy.get('.profile-avatar').click();
        cy.contains('Edit Profile').click();
        cy.get('input[name="firstName"]').clear().type('Jane');
        cy.contains('Save Changes').click();
    });
  
    it('Should logout when Logout button is clicked', () => {
        cy.get('.profile-avatar').click();
        cy.contains('Logout').click();
    });
  });  