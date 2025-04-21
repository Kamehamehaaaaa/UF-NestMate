# UF NestMate

Production Build (Deployed Version): https://uf-nest-mate.vercel.app/

## Important Notice

**Please open the application using Google Chrome or Brave browser.**  
Safari support for the production build is currently limited and will be addressed in a future enhancement.

**Note:** The apartment cards may take **10–60 seconds** to load from the backend, as it is hosted on **Render's free tier**, which may have cold start delays.

## Running the App Locally

Follow the steps below to run the full-stack application on your local machine:

1. **Clone the GitHub repository/Download the ZIP file:**

    - git clone https://github.com/Kamehamehaaaaa/UF-NestMate.git

    Launch VS Code, open the project folder, and use the terminal within VS Code to navigate to the project folder to ensure you are in the correct directory.

2. **Create a .env file in the apis and client directories as needed.**
  
    The required environment variables such as the Cloudinary URL, allowed origins, and React app frontend URL will be provided as a comment in the Canvas submission. This is to ensure the Cloudinary credentials remain private and are not exposed.

3. **Install frontend dependencies:**

    Navigate to the client folder and install all the necessary frontend dependencies.

    - cd client
    - npm install

4. **Start the app:**

    - npm start

Your browser should open and navigate to http://localhost:3000. The apartment cards may take **10–60 seconds** to load from the backend, as it is hosted on **Render's free tier**, which may have cold start delays. To access exclusive features available only to registered users, please sign up or log in to your existing account. For demonstration purposes, I'll provide an account:

**Username:** l@gmail.com <br>
**Password:** l

# Description

The full-stack web application is designed to assist international students in locating the ideal off-campus housing from their home countries. Recognizing the challenges these students face in finding accommodations without visiting in person, this platform offers a streamlined solution. Students can specify their roommate preferences and match with others who share similar interests, making it easier to find compatible housemates. The application provides various filters to help users search for apartments by rating, name, area, or proximity to specific universities. It includes essential information about each apartment, such as its address, nearby amenities, availability, and user reviews. These reviews are used to generate a custom NLP description, offering a realistic and comprehensive overview of the property. Furthermore, students can favorite apartments, which are then displayed in their personalized profile section. Within this section, users can edit their profiles, update preferences, and view details about their matches in the match tab. They can reach out to us at any time by using the contact form on our site to submit their questions and concerns, and we will get back to them as soon as possible.

# Features

-   User Authentication and Profile Management: Secure user login and sign up system allowing students to create, edit, and manage their profiles.
-   Apartment cards: It lists all the available apartments as clickable cards. When clicked, a pop-up opens displaying essential apartment information such as the description, amenities, user reviews, and more.
-   Apartment Search Filters: Advanced filtering options for searching apartments by rating, name, area, or proximity to specific universities.
-   Roommate Matching System: Algorithm to match students with potential roommates based on shared interests and preferences.
-   Custom NLP Description Generator: Utilizes natural language processing to generate detailed and realistic descriptions of properties based on user reviews.
-   Favorites Feature: Allows users to save apartments to their personal profile for easy access later.
-   Contact Form Integration: Provides a platform for users to submit questions and concerns, ensuring prompt communication.
-   Review System: Collects and displays user-generated reviews to assist in making informed decisions about properties.
-   Personalized Profile Section: Houses all user interactions including favorite listings, preferences for getting matched with roommates, and personal details, and edit and logout functionality.
-   Amenities and Availability Display: Lists essential apartment details such as address, nearby amenities, and availability status.

# User Stories

-   International Student Looking for Housing: As an international student, I want to use the web application to find suitable off-campus housing from my home country because I want to ensure I have a place to stay before arriving in the new country. This will allow me to feel secure and prepared for my move.

-   Filtering Housing Options: As an international student, I want to filter housing options based on proximity to my university, ratings, and other criteria so that I can find the most suitable apartment for my needs quickly and efficiently.

-   Roommate Matching: As a student looking for a roommate, I want to specify my roommate preferences and be matched with compatible individuals so that I can live with someone who shares similar interests and lifestyles, enhancing my living experience.

-   Viewing Apartment Details: As a user, I want to view detailed information about each apartment, including addresses, amenities, and availability, so that I can make an informed decision about where to live.

-   Reading User Reviews: As a potential tenant, I want to read user reviews and NLP-generated descriptions of apartments to get an authentic understanding of the property, helping me decide if it meets my expectations.

-   Personal Profile Management: As a user, I want to manage my profile, update my housing and roommate preferences, and view my housing matches so that the system can provide me with tailored recommendations and matches.

-   Favoriting Apartments: As a student, I want to be able to favorite apartments and store them in a personalized section of my profile so that I can easily return to these options and compare them later.

-   Secure and Seamless User Experience: As a user, I want a secure and seamless experience using the application so that I can trust my personal information is safe and navigate the platform without encountering any issues.

# Team

Backend: Go | Frontend: React

-   Anvisha Singh (front-end)
-   Jatin Shivaprakash (back-end)
-   Lakksh Tyagi (front-end)
-   Rohit Bogulla (back-end)
