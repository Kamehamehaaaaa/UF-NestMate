/* eslint-disable no-undef */
describe('SearchResults Component', () => {
  const mockHousingData = [
    {
      id: 1,
      name: "Sweetwater",
      image: "https://res.cloudinary.com/dbldemxes/image/upload/v1742855348/Sweetwater.png",
      description: "A beautiful seaside apartment.",
      address: "123 Ocean Drive, Miami, FL",
      vacancy: 5,
      rating: 4.9,
      comments: [
        "nice apartment!",
        "Loved the seaside view.",
        "User: beautiful"
      ]
    },
    {
      id: 2,
      name: "Stoneridge",
      image: "https://res.cloudinary.com/dbldemxes/image/upload/v1742855348/Sweetwater.png",
      description: "A beautiful seaside apartment.",
      address: "123 Ocean Drive, Miami, FL",
      vacancy: 5,
      rating: 4.8,
      comments: [
        "Great place!",
        "Loved the view."
      ]
    },
  ];

  it('should render housing cards correctly', () => {
    cy.visit('/'); 
    mockHousingData.forEach(housing => {
      cy.contains(housing.name).should('exist');
    });
  });

  it('should open modal with housing details when clicked', () => {
    cy.visit('/');
    cy.get('.clickable-card').first().click();
    cy.get('.housing-modal').should('be.visible');
    cy.contains(mockHousingData[0].name).should('be.visible');
    cy.contains(mockHousingData[0].address).should('be.visible');
  });

  it('should add a comment and display it', () => {
    cy.visit('/'); 
    cy.get('.clickable-card').first().click(); 
    cy.get('.housing-modal').should('be.visible');
    cy.get('button.custom-btn').contains('Add Comment').click();
    cy.get('.housing-modal textarea').type('This is a great place!');
    cy.get('.housing-modal button[type="submit"]').click();
    cy.contains('This is a great place!').should('exist');
  });

  it('should toggle comment form visibility', () => {
    cy.visit('/');
    cy.get('.clickable-card').first().click();
    cy.get('.housing-modal').should('be.visible');
    cy.get('button.custom-btn').contains('Add Comment').click();
    cy.get('.housing-modal textarea').scrollIntoView().should('be.visible');
    cy.get('button.custom-btn').contains('Cancel').click();
  });
  

  it('should open Google Maps with the correct address when clicking the map icon', () => {
    cy.visit('/');
    cy.get('.clickable-card').first().click();
    cy.get('.housing-modal').should('be.visible');
  
    cy.window().then((window) => {
      cy.stub(window, 'open').as('windowOpen');
    });
  
    cy.get('.cursor-pointer').click();
    cy.get('@windowOpen').should('have.been.calledWithMatch', /google\.com\/maps\/search\/\?api=1&query=.*Ocean.*Miami.*FL/);
  });

  it('should close the modal when close button is clicked', () => {
    cy.visit('/');
    cy.get('.clickable-card').first().click();
    cy.get('.housing-modal').should('be.visible');
    cy.get('button.custom-btn').contains('Close').click();
  });

  it('should show no results message when housingData is empty', () => {
    cy.visit('/');
    cy.intercept('GET', '/api/housing', { body: [] });
    cy.contains('No housing options found').should('be.visible');
  });
});