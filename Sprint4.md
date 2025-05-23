## Detail Work Completed in Sprint 4

#### Deployment & Production 

-   The backend was successfully deployed on **Render**, and the frontend on **Vercel**.
-   CORS was configured dynamically to allow cross-origin requests from both localhost and deployed domains, ensuring secure and seamless frontend-backend communication.
-   Environment-based configuration was set up to switch effortlessly between local development and production builds.
-   Code was updated and tested to ensure that all features function correctly in both local and live production environments.

### Frontend Enhancements

#### User Authentication & Profile Experience


-   The **Profile section** now includes two distinct tabs:
    -   **User Profile Tab**:
        -   Displays personal details like **first and last name**.
        -   Lists all **favourited apartments**.
    -   **Roommate Preferences Form**:
        -   Users can input roommate preferences such as:
            -   Monthly budget
            -   Major
            -   Hobbies
            -   Food preferences
            -   Sleeping habits
            -   Cleanliness level
            -   Smoking/drinking preferences
            -   Gender & pet preferences
        -   On clicking **"Save Preferences"**, data is saved directly to **MongoDB Atlas**.
     
   -  Repositioned the **Login button** into the **profile avatar** on the left side of the header so that the user is automatically prompted to login after clicking on the profile avatar if not logged in else it renders the puser profile tab of the user.


#### Apartment Favorites & Interaction

-   Users can **favourite apartments** using the **heart icon** on each apartment card.
-   Favourited apartments are displayed in the **User Profile tab**.
-   Clicking a favourite opens a popup showing:
    -   Apartment image
    -   Address
    -   Vacancy status
    -   Short description
-   Access is **restricted to logged-in users**. Unauthorized access throws an error.

#### Matchmaking System

-   After setting preferences, the **"Match" button** finds students with **similar roommate preferences**.
-   Each match profile displays:
    -   Photo
    -   Major
    -   Budget range
    -   Lifestyle habits
-   Users can browse and compare potential roommates easily.

#### Comments and Attribution

-   Every apartment comment now includes:
    -   **User name**
    -   **Date of comment**
-   Each comment is **linked to a user’s profile**.

#### Google Maps Integration for Amenities

-   Added an **Amenities section** to each apartment card.
-   Clicking the dropdown displays:
    -   Nearby bars, cafes, gyms, restaurants, food stores, etc.
-   Uses the **Google Maps API** and apartment’s **latitude/longitude** to calculate nearby amenities.

#### Enhanced Search Functionality

-   The **search bar** now updates apartment cards **dynamically with each keystroke**.
-   **Ratings filter** is now:
    -   Instantly triggered on click.
    -   No need to manually click the search button after applying filters.
-   Added a new **"Apartment Name" filter** to search directly by name.



### Backend Enhancements

The backend in Sprint 4 was significantly enhanced to support all the newly added features on the frontend and ensure seamless user experience across both local and production environments.

#### User Preferences & Matching

-   We added robust backend support for storing and retrieving user preferences related to their ideal roommate — including budget, cleanliness, sleep schedules, guest policy, and more.
-   Once preferences are submitted, the backend computes potential matches by comparing the current user’s preferences with others in the system.
-   The matchmaking algorithm and endpoint ensures that users get a list of potential roommates ranked by compatibility.

#### Favorites System

-   A new module was introduced for managing favorites. Users can now mark any apartment as a favorite, and this data is stored securely in the backend.
-   Dedicated endpoints were implemented to add, remove, and retrieve a user's favorites.
-   The system ensures that only logged-in users can modify or view their personalized favorites list.

#### NLP-Based Review Summarizer (Prototype Phase)

-   To make apartment listings more informative, we prototyped a summarization feature that generates concise descriptions for each apartment based on user-submitted reviews.
-   This is powered by an NLP model which processes all the comments under a given apartment and returns a short paragraph highlighting the general sentiment and key themes (e.g., safety, cleanliness, management responsiveness).
-   Though not fully deployed yet, the backend structure and endpoints for this feature have been prepared.

#### Commenting System

-   The backend now supports a complete commenting system. Users can post reviews for apartments, which are timestamped and linked to their profile.
-   Endpoints were implemented for adding, deleting, and retrieving comments — both individually and in bulk.
-   This system not only allows community feedback but also serves as input for the NLP summarizer.

#### Housing Data & Filters

-   Users can now filter apartments by ratings directly, with the backend processing filter logic and returning sorted results instantly.
-   Sorting apartments by distance from a given location was introduced, using geolocation data and supporting logic on the backend.
-   The backend was integrated with Google Maps Places API to fetch nearby amenities for apartments, enriching listings with nearby cafes, gyms, grocery stores, and more.



## Frontend Unit Tests

### Matches Component Tests (New)

- Displays "no matches found" when empty  
- Displays match cards when data is fetched  
- Opens modal when card is clicked  
- Displays basic info in modal  
- Handles API errors gracefully  
- Parses hobbies correctly  
- Shows default values for missing preferences  
- Handles image loading errors  
- Closes modal when close button is clicked  
- Renders different tabs in modal  

### RoommatePreferencesForm Component Tests (New)

- Renders form with initial preferences  
- Updates budget range when inputs change  
- Updates major field when changed  
- Updates hobbies field when changed  
- Changes food preference dropdown selection  
- Toggles smoking preference radio buttons  
- Adjusts cleanliness slider  
- Changes gender preference radio buttons  
- Submits form with updated data  
- Validates numeric inputs for budget  
- Maintains cleanliness value between 1–5  


### Profile Component Tests

-   Renders profile information correctly in view mode
-   Displays the "Edit Profile" button
-   Enters edit mode when "Edit Profile" is clicked
-   Changes profile data when editing and saves the changes
-   Closes the modal when close button is clicked
-   Displays correct title based on edit mode
-   Cancels editing and reverts changes when Cancel button is clicked
-   Checks if the favorrites/wishlisted apartments are rendered in this section (New)

### Search Component Tests

-   Renders search input field
-   Updates search input value on change
-   Fetches housing data on initial load
-   Calls handleSearch when search button is clicked
-   Filters results based on apartment name
-   Changes filter type to location when selected from dropdown
-   Scrolls to contact section when scrollToContact is called
-   Displays all dropdown options when filter button is clicked
-   Changes placeholder text to "University Name" when location filter is selected
-   Search results update correctly when a new filter is selected and search is performed

### SearchResults Component Tests

-   Renders the component without crashing
-   Displays housing data when available
-   Opens modal when housing card is clicked
-   Modal displays correct details
-   Renders star ratings correctly
-   Opens Google Maps when location icon is clicked
-   Displays comments correctly
-   Toggles comment form when Add Comment is clicked
-   Adds a new comment correctly
-   Closes modal when Close button is clicked
-   Checks if the nearby amenities section is rendered when selected (New)

### ContactForm Component Tests

-   Renders ContactForm correctly
-   Handles input change correctly
-   Displays success message on successful submission
-   Displays error message on failed submission

### Login Component Tests

-   Renders login form initially
-   Switches to signup form when clicking sign up link
-   Switches back to login form when clicking login link
-   Calls onClose when close button is clicked



## Cypress tests

### App Component Tests

-   Should load the header and main sections correctly
-   Should fetch and display housing data on load
-   Should filter apartments by name when searched
-   Should fetch and filter by rating when selected
-   Should fetch and sort apartments by location (university)
-   Should scroll to the contact section when clicking contact
-   Should be able to click on profile avatar for login pop
-   Should navigate to /matches page when Matches button is clicked
-   Should stay on the home page when Home button is clicked
-   Eye movement animation should update eye position on mouse move
-   Eye movement animation should render the eyeballs inside the logo

### Contact Form Component Tests

-   Should render the contact form
-   Should allow user to type in the form fields
-   Should show error if required fields are empty
-   Should submit the form successfully
-   Should show error if email sending fails

### Login Component Tests

-   Should open the login modal
-   Should fail login with incorrect credentials
-   Should log in successfully with correct credentials
-   Should switch to signup mode
-   Should fail signup with mismatched passwords
-   Should sign up successfully

### Match Component Tests

-   Should navigate to Roomate Matching page when Matches button is clicked
-   Should show matches based on roomate preference
-   Should display "No matches found" if user is not logged in
-   Should display "No matches found" if user has no matches
-   Should display first name, last name, major, and budget on the user card
-   Should open modal and show profile info when a match card is clicked
-   Should switch tabs in modal to Preferences
-   Should fallback to default image if profile picture fails to load
-   Should close modal when close button is clicked

### Profile Section Component Tests

-   Should display profile info by default
-   Should switch to preferences tab and load data
-   Should load the form with default or pre-filled values for new users
-   Should edit preferences and show success message
-   Should open and close apartment modal
-   Should enter edit mode and change name
-   Should logout when Logout button is clicked

### Search Results Component Tests

-   Should render housing cards correctly
-   Should open modal with housing details when clicked
-   Should add a comment and display it
-   Should toggle comment form visibility
-   Should open Google Maps with the correct address when clicking the map icon
-   Should show alert when clicking favorite without logging in
-   Should toggle favorite when user is logged in
-   Should display star ratings on apartment cards
-   Should show Amenities section when clicked in modal
-   Should close the modal when close button is clicked
-   Should show no results message when housingData is empty

<img width="1440" alt="Screenshot 2025-04-20 at 5 06 05 AM" src="https://github.com/user-attachments/assets/a7b711b0-aa89-49d4-8f20-b01fccda000f" />
<img width="1440" alt="Screenshot 2025-04-20 at 5 06 14 AM" src="https://github.com/user-attachments/assets/618bf106-10fa-487a-9bdb-1bbc7eb03c97" />
<img width="1440" alt="Screenshot 2025-04-20 at 5 06 24 AM" src="https://github.com/user-attachments/assets/42e20297-3713-40ce-b516-e3297b7e1374" />
<img width="1440" alt="Screenshot 2025-04-20 at 5 06 39 AM" src="https://github.com/user-attachments/assets/ff551099-f772-437b-a9a6-f70db6a0c302" />
<img width="1440" alt="Screenshot 2025-04-20 at 5 06 56 AM" src="https://github.com/user-attachments/assets/cc1a6599-2827-4dab-b108-303de5f14a31" />
<img width="1440" alt="Screenshot 2025-04-20 at 5 07 06 AM" src="https://github.com/user-attachments/assets/02bbd0f1-3106-408f-b2d3-80ce61ef75e2" />

## Backend Unit Test

### For User APIs

**TestRegisterHandler**

-   /api/user/register
-   This registers new users.
-   This has two test cases: Register User Success, Register User Failure.

**TestUpdateUserHandler**

-   /api/user/update
-   This updates users first name and last name.
-   This has one test case: Register User Success.

**TestDeleteHandler**

-   /api/user/delete
-   This Deletes user from database.
-   This has two test cases: Delete User Success, Delete User Failure.

**TestGetUserHandler**

-   /api/user/getUser
-   This fetches user from database.
-   This has two test cases: Get User Success, Get User Failure.

**TestLoginHandler**

-   /api/user/login
-   This Logs in user into system using user name and password.
-   This has two test cases: Login User Success, Login User Failure.

### For Housing APIs

**TestAddHousingHandler**

-   /api/housing/add
-   This adds new property into the system.
-   This has three test cases: Valid property data, Invalid JSON data, Property already exists.

**TestGetHousingHandler**

-   /api/housing/get/:query
-   This fetches property data usong the ID.

**TestGetAllHousingHandler**

-   /api/housing/getAll
-   This Fetches all the property registered in our website.

**TestUpdateHousingHandler**

-   api/housing/update
-   This Updates property name.
-   This has two test cases: Updated property data, Property dosen't exists.

**TestDeleteHousingHandler**

-   /api/housing/delete/:query
-   This deletes property from our website.
-   This has two test cases: Delete property , Invalid Property.

**TestUploadImgHandler**

-   /api/housing/uploadimg
-   This uploads property images to our database.

### For Comments APIs

**AddCommentHandler**

-   /api/comments/add
-   This adds comments for specific apartments.
-   This has two test cases: Add comment successful, Add comment failed

**DeleteCommentHandler**

-   /api/comments/delete/:query
-   This deletes comments for specific apartments.

**GetAllCommentsHandler**

-   /api/comments/getAll/:query
-   This fetches all the comments related to specific apartments.
-   This has two test cases: Get all comment sucessful, Get all comment failed.

### For Favorites APIs

**AddFavoriteHandler**

-   /api/user/favorites/add
-   This adds favorite apartments to the profile.

**RemoveFavoriteHandler**

-   api/user/favorites/remove
-   This removes favorite apartments from profile.

**GetFavoritesHandler**

-   /api/user/favorites
-   This fetches all the apartments which the user has added into their favourites.

**GetPreferencesHandler**

-   /api/user/preferences
-   This fetches the preferences given by an user.

**SavePreferencesHandler**

-   /api/user/preferences
-   This saves all the preferences the user chooses.

**GetMatchesHandler**

-   /api/user/matches
-   This fetches all the users whose preferences are matching with the current user.

**GetNearbyAmenitiesHandler**

-   /api/housing/amenities/:query
-   This has the query paramenter of apartments.
-   When the user searches a specific apartment, this api fetches all the nearby amenities.


## API Documentation

### Table of Contents

-   [Users](#users)
-   [Housing Properties](#housing-properties)
-   [Comments](#comments)
-   [Filtering and Sorting](#filtering-and-sorting)

### Register a new user

```
POST /api/user/register
```

**Request Body:**

```json
{
	"firstname": "string",
	"lastname": "string",
	"username": "string",
	"password": "string",
	"email": "string"
}
```

**Responses:**

-   `201`: User registered successfully
-   `400`: Invalid JSON data or user already exists
-   `500`: Error while adding the user

### Login a user

```
POST /api/user/login
```

**Request Body:**

```json
{
	"username": "string",
	"password": "string"
}
```

**Responses:**

-   `200`: Login successful
-   `400`: Invalid JSON data
-   `401`: Invalid credentials

## Users

### Get user by username

```
GET /api/user/getUser?username={username}
```

**Parameters:**

-   `username` (query, required): Username of the user to retrieve

**Responses:**

-   `200`: User found
-   `404`: User not found

### Delete user by username

```
GET /api/user/delete?username={username}
```

**Parameters:**

-   `username` (query, required): Username of the user to delete

**Responses:**

-   `204`: User deleted
-   `404`: User not found

### Update user information

```
PUT /api/user/update
```

**Request Body:**

```json
{
	"username": "string",
	"password": "string",
	"firstName": "string",
	"lastName": "string"
}
```

**Responses:**

-   `200`: User updated successfully
-   `400`: Invalid JSON data or username required
-   `404`: User not found
-   `500`: Internal server error

## Housing Properties

### Add a new housing property

```
POST /api/housing/add
```

**Request Body:**

```json
{
	"id": 0,
	"name": "string",
	"image": "string",
	"description": "string",
	"address": "string",
	"vacancy": 0,
	"rating": 0,
	"comments": ["string"]
}
```

**Responses:**

-   `200`: Property stored successfully
-   `400`: Invalid JSON data
-   `500`: Failed to store property data

### Get a housing property by ID

```
GET /api/housing/get/{query}
```

**Parameters:**

-   `query` (path, required): ID of the housing property to retrieve

**Responses:**

-   `200`: Property found
-   `404`: Property not found

### Delete a housing property

```
DELETE /api/housing/delete
```

**Responses:**

-   `200`: Property deleted successfully
-   `400`: Invalid delete

### Update a housing property

```
PUT /api/housing/update
```

**Request Body:**

```json
{
	"id": 0,
	"name": "string",
	"image": "string",
	"description": "string",
	"address": "string",
	"vacancy": 0,
	"rating": 0,
	"comments": ["string"]
}
```

**Responses:**

-   `200`: Property updated successfully
-   `400`: Invalid JSON data or invalid update
-   `500`: Failed to update property data

### Get all housing properties

```
GET /api/housing/getAll
```

**Responses:**

-   `200`: List of properties
-   `500`: Failed to retrieve properties

### Upload an image for a housing property

```
POST /api/housing/uploadimg
```

**Request Body:**

-   `image` (binary): The image file to upload

**Responses:**

-   `200`: Image uploaded successfully
-   `400`: Failed to get image
-   `500`: Failed to upload image to Cloudinary

### Get summary for apartment using its reviews

```
GET /api/housing/summary?query={query}
```

**Parameters:**

-   `query` (path, required): Query to identify the apartment

**Responses:**

-   `200`: Summary generated
-   `404`: Property not found

## Comments

### Add a new comment to a housing property

```
POST /api/comments/add
```

**Request Body:**

```json
{
	"apartmentId": 0,
	"comment": "string"
}
```

**Responses:**

-   `200`: Comment added successfully
-   `400`: Invalid JSON data or apartment doesn't exist
-   `500`: Failed to save comment

### Delete a comment

```
DELETE /api/comments/delete
```

**Responses:**

-   `200`: Comment deleted successfully
-   `400`: Invalid delete or comment doesn't exist

### Get a comment by ID

```
GET /api/comments/get
```

**Responses:**

-   `200`: Comment found
-   `400`: Comment doesn't exist

## Filtering and Sorting

### Get properties sorted by rating

```
GET /api/filter/ratings
```

**Responses:**

-   `200`: Properties sorted by rating
-   `404`: No properties exist

### Get housing properties sorted by distance from a university

```
GET /apt/housing/sortByDistance?university={university}
```

**Parameters:**

-   `university` (query, required): Name of the university for distance calculation

**Responses:**

-   `200`: List of properties sorted by distance
-   `400`: University name required or failed to fetch apartments
-   `500`: Failed to calculate distances or fetch apartments

## Favoutrites and preferences

###  Add Apartment to Favorites

```
POST /api/favorites/add
```

**Request Body:**

```json
{
  "username": "string",
  "aptId": 123
}
```

**Responses:**

- `200`: Added to favorites  
- `400`: Invalid request  
- `404`: User not found  
- `500`: Failed to add favorite  


### Remove Apartment from Favorites

```
POST /api/favorites/remove
```

**Request Body:**

```json
{
  "username": "string",
  "aptId": 123
}
```

**Responses:**

- `200`: Removed from favorites  
- `400`: Invalid request  
- `500`: Failed to remove favorite  


### Get Favorite Apartments

```
GET /api/favorites/get?username=string
```

**Responses:**

- `200`:  
```json
{
  "count": 2,
  "favorites": [ /* apartment list */ ]
}
```
- `400`: Username is required  
- `500`: Failed to retrieve favorites  


### Save User Preferences

```
POST /api/preferences/save
```

**Request Body:**

```json
{
  "username": "string",
  "preferences": {
    "budget": {
      "min": 500,
      "max": 1200
    },
    "major": "string",
    "hobbies": "string",
    "food": "string",
    "sleepingHabit": "string",
    "smokingDrinking": "string",
    "cleanliness": 4,
    "genderPreference": "string",
    "petPreference": "string"
  }
}
```

**Responses:**

- `200`: Preferences saved successfully  
- `400`: Invalid request  
- `500`: Failed to save preferences  


### Get User Preferences

```
GET /api/preferences/get?username=string
```

**Responses:**

- `200`:  
```json
{
  "preferences": {
    "budget": {
      "min": 500,
      "max": 1200
    },
    "major": "string",
    "hobbies": "string",
    "food": "string",
    "sleepingHabit": "string",
    "smokingDrinking": "string",
    "cleanliness": 4,
    "genderPreference": "string",
    "petPreference": "string"
  }
}
```
- `400`: Username is required  
- `500`: Failed to retrieve preferences  


###  Get Matched Users by Preferences

```
GET /api/preferences/match?username=string
```

**Responses:**

- `200`:  
```json
{
  "matches": [ /* list of matching users */ ]
}
```
- `400`: Username is required or preferences not set  
- `500`: Failed to retrieve users

### Get Nearby Amenities for a Property

```
GET /api/housing/amenities/{query}
```

**Path Parameter:**
- `query` – The ID or name of the property

**Description:**
Fetches nearby amenities such as restaurants, gyms, supermarkets, and cafes using the property's coordinates.

**Responses:**

- `200 OK`: Returns nearby amenities  
```json
{
  "amenities": {
    "restaurant": [
      { "name": "Pita Pit", "address": "123 Main St" }
    ],
    "gym": [
      { "name": "Planet Fitness", "address": "456 Fit Ln" }
    ],
    "supermarket": [],
    "cafe": []
  }
}
```

- `404 Not Found`:  
```json
{
  "error": "Property not found"
}
```