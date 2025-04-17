/* eslint-disable no-undef */
describe('SearchResults Component', () => {
    const mockHousingData = [     // Just to check if these show up on the homepage directly from MongoDB database
      {
        id: 1,
        name: "Sweetwater",
        image: "https://res.cloudinary.com/dbldemxes/image/upload/v1742855348/Sweetwater.png",
        description: "A beautiful seaside apartment.",
        address: "123 Ocean Drive, Miami, FL",
        vacancy: 10,
        rating: 4.8,
        comments: [
          "nice apartment!",
          "Loved the seaside view.",
          "User: beautiful"
        ],
        lat: 40.748817,
        lng: -73.985428
      },
      {
        id: 2,
        name: "Stoneridge",
        image: "https://res.cloudinary.com/dbldemxes/image/upload/v1742855322/Stoneridge.png",
        description: "A beautiful seaside apartment.",
        address: "123 Ocean Drive, Miami, FL",
        vacancy: 5,
        rating: 4.8,
        comments: [
          "Great place!",
          "Loved the view."
        ],
        lat: 40.748817,
        lng: -73.985428
      },
    ];
  
    it('Should render housing cards correctly', () => {
      cy.visit('/'); 
      mockHousingData.forEach(housing => {
        cy.contains(housing.name).should('exist');
      });
    });
  
    it('Should open modal with housing details when clicked', () => {
      cy.visit('/');
      cy.get('.clickable-card').first().click();
      cy.get('.housing-modal').should('be.visible');
      cy.contains(mockHousingData[0].name).should('be.visible');
      cy.contains(mockHousingData[0].address).should('be.visible');
    });
  
    it('Should add a comment and display it', () => {
      cy.visit('/'); 
      cy.get('.clickable-card').first().click(); 
      cy.get('.housing-modal').should('be.visible');
      cy.get('button.custom-btn').contains('Add Comment').click();
      cy.get('.housing-modal textarea').type('This is a great place!');
      cy.get('.housing-modal button[type="submit"]').click();
      cy.contains('This is a great place!').should('exist');
    });
  
    it('Should toggle comment form visibility', () => {
      cy.visit('/');
      cy.get('.clickable-card').first().click();
      cy.get('.housing-modal').should('be.visible');
      cy.get('button.custom-btn').contains('Add Comment').click();
      cy.get('.housing-modal textarea').scrollIntoView().should('be.visible');
      cy.get('button.custom-btn').contains('Cancel').click();
    });
    
  
    it('Should open Google Maps with the correct address when clicking the map icon', () => {
      cy.visit('/');
      cy.get('.clickable-card').first().click();
      cy.get('.housing-modal').should('be.visible');
    
      cy.window().then((window) => {
        cy.stub(window, 'open').as('windowOpen');
      });
    
      cy.get('.cursor-pointer').click();
      cy.get('@windowOpen').should('have.been.calledWithMatch', /google\.com\/maps\/search\/\?api=1&query=.*Ocean.*Miami.*FL/);
    });
  
    it('Should show alert when clicking favorite without logging in', () => {
      cy.visit('/');
      cy.window().then((win) => {
        cy.stub(win, 'alert').as('alertStub');
      });
    
      cy.get('.favorite-outline').first().click();
      cy.get('@alertStub').should('have.been.calledWith', 'Please log in to save favorites!');
    });

    it('Should toggle favorite when user is logged in', () => {
      cy.visit('/');
      cy.intercept('POST', 'http://localhost:8080/api/user/login', {
        statusCode: 200,
        body: { message: 'Login successful' },
      });

      cy.intercept('GET', 'http://localhost:8080/api/user/getUser?username=testuser', {
          statusCode: 200,
          body: {
              username: 'johndoe',
              firstName: 'John',
              lastName: 'Doe',
          },
      });

      cy.get('.profile-avatar').click(); 
      cy.get('.login-popup').should('be.visible');
      cy.get('.login-popup input[type="text"]').should('be.visible').type('johndoe');
      cy.get('.login-popup input[type="password"]').should('be.visible').type('securePass123');
      cy.get('.login-popup button[type="submit"]').click();
    
      cy.intercept('POST', '/api/user/favorites/add', {
        statusCode: 200,
        body: {},
      });
    
      cy.get('.favorite-outline').first().click();
      cy.get('.favorite-filled').should('exist');
    });

    it('Should display star ratings on apartment cards', () => {
      cy.visit('/');
      cy.get('.bi-star-fill').should('have.length.greaterThan', 0);
    });

    it('Should show Amenities section when clicked in modal', () => {
      cy.visit('/');
      cy.get('.clickable-card').first().click();
      cy.get('.housing-modal').should('be.visible');
    
      cy.contains('Amenities').scrollIntoView().click();
      cy.contains('Nearby Amenities').should('exist');
    });
    

    it('Should close the modal when close button is clicked', () => {
      cy.visit('/');
      cy.get('.clickable-card').first().click();
      cy.get('.housing-modal').should('be.visible');
      cy.get('button.custom-btn').contains('Close').click();
    });
  
    it('Should show no results message when housingData is empty', () => {
      cy.visit('/');
      cy.intercept('GET', '/api/housing', { body: [] });
      cy.contains('No housing options found').should('be.visible');
    });
  });