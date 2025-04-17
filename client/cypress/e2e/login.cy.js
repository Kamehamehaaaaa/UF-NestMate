/* eslint-disable no-undef */
describe('Login and Signup Tests', () => {
    beforeEach(() => {
        cy.visit('/');
    });
  
    it('Should open the login modal', () => {
        cy.get('.profile-avatar').should('exist');
        cy.get('.profile-avatar').click();
    });
  
    it('Should fail login with incorrect credentials', () => {
        cy.get('.profile-avatar').click();
        cy.get('.login-popup').should('be.visible');
        cy.get('.login-popup input[type="text"]').type('wronguser@example.com');
        cy.get('.login-popup input[type="password"]').type('wrongpassword');
        cy.get('.login-popup button[type="submit"]').click();
        cy.get('.login-popup .error-message').should('contain', 'Invalid credentials');
    });
      
  
    it('Should log in successfully with correct credentials', () => {
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
    });
  
    it('Should switch to signup mode', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').should('be.visible');
        cy.contains("Don't have an account? Sign Up").click();
        cy.contains('Sign Up').should('be.visible');
        cy.get('input[type="text"]').should('have.length', 4);
    });
  
    it('Should fail signup with mismatched passwords', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').contains("Don't have an account? Sign Up").should('be.visible').click();
        cy.get('input').eq(0).should('be.visible').type('John');
        cy.get('input').eq(1).should('be.visible').type('Doe');
        cy.get('input').eq(2).should('be.visible').type('johndoe@example.com');
        cy.get('input[type="password"]').eq(0).should('be.visible').type('password123');
        cy.get('input[type="password"]').eq(1).should('be.visible').type('password456');
        cy.get('button.button-signup').click();
        cy.contains("Passwords don't match!").should('be.visible');
    });
    
  
    it('Should sign up successfully', () => {
        cy.get('.profile-avatar').click(); 
        cy.get('.login-popup').contains("Don't have an account? Sign Up").should('be.visible').click();
        cy.get('input').eq(0).type('Jane');
        cy.get('input').eq(1).type('Doe');
        cy.get('input').eq(2).type('janedoe@example.com');
        cy.get('input[type="password"]').eq(0).type('securepassword');
        cy.get('input[type="password"]').eq(1).type('securepassword');
    
        cy.intercept('POST', 'http://localhost:8080/api/user/register', {
            statusCode: 200,
            body: { message: 'Registration successful' },
        });
    
        cy.get('button.button-signup').click();
    });
  });  