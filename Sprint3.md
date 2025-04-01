
## Detail Work Completed in Sprint 3

### Frontend Enhancements

  **NLP-Generated Descriptions from Comments**
    -   Implemented a feature where user comments on apartment cards are analyzed using Natural Language Processing (NLP) in the backend.
    -   The NLP module generates concise summaries from these comments, giving users a quick, digestible overview of community feedback.
    -   Modified the SearchResults component to display these summaries alongside apartment details, enhancing the decision-making process.
  **Dropdown Filter for Location Distance**
    -   Extended the existing Dropdown component in App.js with a new "Location (University)" filter option.
    -   This filter sorts apartments by their distance from a user-specified university, leveraging the Google Distance Matrix API via a backend endpoint.
    -   Updated the handleSearch function to fetch and display results in ascending order of distance, improving location-based search accuracy.
 **Filter Based on Ratings**
    -   Enhanced the "Rating" filter option in the Dropdown to fetch and sort apartments based on aggregated user ratings stored in the database.
    -   Integrated this with the backend API endpoint /api/filter/ratings, ensuring sorted results are reflected in the SearchResults component.
  **Cloudinary Image Integration**
    -   Migrated all local image assets (e.g., Home_pic.jpg) to Cloudinary, a cloud-based image management service.
    -   Updated the frontend to dynamically pull image URLs from Cloudinary via API responses, removing all local file dependencies and improving scalability.
  **Frontend Animations**
    -   Added visually appealing animations to key components such as the cursor eye animation
    -   Used CSS keyframes or a library like react-spring to implement effects like fade-ins and slide-ins, enhancing the overall user experience.
  **User Comments on Apartment Cards**
    -   Extended the SearchResults component to include an interactive comment section for each apartment card.
    -   Users can now post comments directly from the frontend, which are sent to the backend, stored in MongoDB, and displayed in real-time.

### Backend Enhancements

  **MongoDB Database Setup**
    -   Established a MongoDB database to persist apartment data, user profiles, comments, and ratings.
    -   Defined schemas for all 
  **End-to-End API Integration**
    -   Fully integrated backend APIs with the frontend and database.Refer to updated api documentation for newly added API
    -   Ensured all CRUD operations (Create, Read, Update, Delete) for apartments, comments, and user data are operational and tested.
  **Google Distance Matrix API Integration**
    -   Built a backend service to interact with the Google Distance Matrix API, calculating distances between apartment locations and a specified university.
    -   Added a new endpoint (/api/housing/sortByDistance) that processes distance data and returns a sorted list of apartments.
  **NLP Text Summarization**
    -   Developed a backend service using an NLP library (e.g., spaCy, NLTK, or a pre-trained model like BERT) to summarize user comments.
    -   Integrated this service into the comments workflow, updating apartment records with generated summaries that are sent to the frontend.
 **Login and Registration System**
     -   Added profile update functionality (e.g., updating name, email, preferences), with changes persisted in MongoDB.
    -   All changes are now getting persisted in the database
    **Password Hashing**
    -   Implemented secure password hashing using bcrypt in the backend.
    -   Ensured passwords are hashed before storage in MongoDB and securely verified during login attempts, enhancing authentication security.

## Future Enhancements and Improvements

**Real-Time Notifications**
    -   Implement a notification system (e.g., via WebSockets) to alert users when new comments or ratings are added to their favorited apartments.
 **User Preferences Personalized recommendations**
    -   Allow users to save search preferences (e.g., preferred universities, rating thresholds) in their profiles for personalized recommendations.
 **Analytics Dashboard**
    -   Develop an admin dashboard to track user activity, popular apartments, and comment trends, aiding in data-driven improvements.
    **Use HTTPS for Secure Communication**
 -Transition all API endpoints and frontend requests to use HTTPS instead of HTTP. This will encrypt data in transit, protect user credentials and sensitive information, and align with modern web security standards, especially critical for production deployment.

## Frontend Unit Tests

### Profile Component Tests

- Renders profile information correctly in view mode
- Displays the "Edit Profile" button
- Enters edit mode when "Edit Profile" is clicked
- Changes profile data when editing and saves the changes
- Closes the modal when close button is clicked
- Displays correct title based on edit mode
- Cancels editing and reverts changes when Cancel button is clicked

### Search Component Tests

- Renders search input field
- Updates search input value on change
- Fetches housing data on initial load
- Calls handleSearch when search button is clicked
- Filters results based on apartment name
- Changes filter type to location when selected from dropdown
- Scrolls to contact section when scrollToContact is called
- Displays all dropdown options when filter button is clicked
- Changes placeholder text to "University Name" when location filter is selected
- Search results update correctly when a new filter is selected and search is performed

### SearchResults Component Tests

- Renders the component without crashing
- Displays housing data when available
- Opens modal when housing card is clicked
- Modal displays correct details
- Renders star ratings correctly
- Opens Google Maps when location icon is clicked
- Displays comments correctly
- Toggles comment form when Add Comment is clicked
- Adds a new comment correctly
- Closes modal when Close button is clicked

### ContactForm Component Tests

- Renders ContactForm correctly
- Handles input change correctly
- Displays success message on successful submission
- Displays error message on failed submission

### Login Component Tests

- Renders login form initially
- Switches to signup form when clicking sign up link
- Switches back to login form when clicking login link
- Calls onClose when close button is clicked
