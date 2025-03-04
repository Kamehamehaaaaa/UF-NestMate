# Sprint 2

## Issues Completed
1. Integration of frontend and backend, using apis to carryout neccessary functionality.
2. Added apis for comments on apartments with ratings on the apartment.
3. A user profile section for users to manage the user information.
4. Contact form functionality for users to connect with apartment representatives for queries.
5. Using my sql database for data storing operations.
6. Apartment cards to display all the apartments in the area.
7. Frontend support for adding comments and ratings to apartments.
8. Enhancement on existing backend apis previously using form data now migrated to JSON.
9. Frontend support to register users which was buggy in previous sprint.
    
## Issues Not Completed and Reasons

1. Apartment filters not implemented: The backend support for apartment filters is still being worked on. This will be completed by first half of next sprint.
2. Apartment Review summarizer: An automatic summarizer which summarizes reviews which will help the user to get an overview of the apartment. This is the next task on priority.

## Backend Unit Tests
1. TestRegisterUserHandler
2. TestRegisterUserHandler
3. TestGetUserHandler
4. TestLoginHandler
5. TestAddCommentHandler
6. TestGetCommentHandler
7. TestGetCommentHandler2
8. TestDeleteCommentHandler
9. TestAddHousingHandler
10. TestGetHousingHandler
11. TestUpdateHousingHandler
12. TestDeleteHousingHandler

## Frontend Unit tests
We use Jest and React Testing Library for unit testing. The test suite covers the main components of the application:

### App Component Tests
- Renders "Apartment Finder" text
- Renders search input
- Tests search functionality
- Verifies rendering of Header, SearchResults, and ContactForm components

### ContactForm Component Tests
- Renders "Contact Us" heading
- Renders form fields (Name, Email, Message)
- Updates form fields on input
- Submits form and shows success message
- Shows error message on submission failure

### ProfilePage Component Tests
- Renders profile information
- Switches to edit mode when "Edit Profile" is clicked
- Updates profile information when edited
- Saves edited profile when "Save" is clicked
- Closes profile page when close button is clicked

### Header Component Tests
- Renders logo
- Renders navigation links
- Renders login button
- Tests contact link functionality
- Tests login modal display
- Tests profile modal display
- Verifies active link changes on click

## API Documentation
API documentation can be found in the file named "API Specification.docx".
