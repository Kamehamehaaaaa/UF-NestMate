/* eslint-disable no-undef */
describe('Contact Form Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Should render the contact form', () => {
    cy.get('.contact-heading').should('contain', 'Contact Us');
    cy.get('form').should('exist');
  });

  it('Should allow user to type in the form fields', () => {
    cy.get('input[name="name"]').type('John Doe').should('have.value', 'John Doe');
    cy.get('input[name="email"]').type('john@example.com').should('have.value', 'john@example.com');
    cy.get('textarea[name="message"]').type('Hello, this is a test message.').should('have.value', 'Hello, this is a test message.');
  });

  it('Should show error if required fields are empty', () => {
    cy.get('button[type="submit"]').click();
    cy.get('input:invalid').should('have.length', 2);
    cy.get('textarea:invalid').should('have.length', 1);
  });

  it('Should submit the form successfully', () => {
    cy.intercept('POST', 'https://api.emailjs.com/api/v1.0/email/send', { statusCode: 200, body: {} }).as('sendEmail');
    
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('textarea[name="message"]').type('Hello, this is a test message.');
    
    cy.get('button[type="submit"]').click();
    cy.wait('@sendEmail');
    cy.get('.status-message.success').should('contain', 'Your message has been sent successfully!');
  });

  it('Should show error if email sending fails', () => {
    cy.intercept('POST', 'https://api.emailjs.com/api/v1.0/email/send', { statusCode: 500 }).as('sendEmailFail');
    
    cy.get('input[name="name"]').type('John Doe');
    cy.get('input[name="email"]').type('john@example.com');
    cy.get('textarea[name="message"]').type('Hello, this is a test message.');
    
    cy.get('button[type="submit"]').click();
    cy.wait('@sendEmailFail');
    cy.get('.status-message.error').should('contain', 'Failed to send message. Please try again later.');
  });
});