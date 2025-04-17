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

    it('Should be able to click on profile avatar for login pop', () => {
      cy.get('.profile-avatar').should('exist');
      cy.get('.profile-avatar').click();
    });

    it('Should navigate to /matches page when Matches button is clicked', () => {
      cy.get('header').contains('Match').click();
      cy.url().should('include', '/matches');
    });

    it('Should stay on the home page when Home button is clicked', () => {
      cy.get('header').contains('Home').click();
      cy.url().should('eq', 'http://localhost:3000/');
    });
  

    it('Eye movement animation should update eye position on mouse move', () => {
      cy.get('.eye').should('have.length', 2);
      cy.get('.logo-container').trigger('mousemove', { clientX: 200, clientY: 300, force: true });

      cy.wait(200);

      cy.get('.eye').each(($eye) => {
        cy.wrap($eye)
          .invoke('attr', 'style')
          .should('match', /--pupil-x: .*px;/)
          .and('match', /--pupil-y: .*px;/);
      });
    });
  
    it('Eye movement animation should render the eyeballs inside the logo', () => {
      cy.get('.logo-container .eye').should('have.length', 2);
    });

  });  