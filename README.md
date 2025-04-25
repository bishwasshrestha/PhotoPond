# PhotoPond     

PhotoPond is a full-stack social media web application where users can upload and browse pictures, interact with posts, and manage their profiles.

## Features

- **User Authentication**: Login and register with secure password hashing and JWT-based authentication.
- **Image Upload**: Upload images and view posts from other users.
- **Search**: Search for posts by username.
- **Reactions**: Like and comment on posts.
- **Profile Management**: Edit profile details and upload profile pictures.
- **Post Management**: Delete your own posts.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Built With

- **Backend**:
  - [Express.js](https://expressjs.com/) - Web application framework for Node.js.
  - [MySQL](https://www.mysql.com/) - Relational database for storing user and post data.
  - [Passport.js](http://www.passportjs.org/) - Authentication middleware.
  - [JWT](https://jwt.io/) - JSON Web Tokens for secure authentication.
  - [Multer](https://github.com/expressjs/multer) - Middleware for handling file uploads.
  - [Helmet](https://helmetjs.github.io/) - Security middleware for HTTP headers.
  - [dotenv](https://github.com/motdotla/dotenv) - Environment variable management.

- **Frontend**:
  - Vanilla JavaScript for dynamic interactions.
  - HTML5 and CSS3 for responsive design.
  - FontAwesome for icons.


# Code Structure

    backend
        │
        └─── controllers            #request managers
        └─── db                     #connection to the DB
        └─── models                 #handling/communicate with database
        └─── routes                 #define the endpoints
        └─── utils                  #facilitate with validation etc
        └─── server.js              #HTTP server that listens to server port
        └─── .env                   #store all environment variables
        └─── .gitignore             #git ignore file
        └─── package-lock.json      #npm automatically generated document
        └─── package.json           #holds metadata and npm packagage list
        └─── tables.txt             #queries to create DB tables

    frontend
        │
        └─── public
            └─── css                #styling files
            └─── images             #all the images used
            └─── js                 #CRUD operations and DOM manipulation
            └─── profiles           #all the profile pictures
            └─── uploads            #all uploded images
            └─── login.html         #html for authentication
            └─── index.html         #static page for home page
            └─── profile.html       #static page for profile page
            

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) and npm installed.
- [MySQL](https://www.mysql.com/) database set up.

# Getting Started

1. Clone the repository:
   
   ```bash
   git clone https://github.com/bishwasshrestha/PhotoPond.git
   cd PhotoPond
   ```
   
1. Install dependencies
   ```bash
    npm install
   ```

1. Setup the .env file with your enviroment variables
   ```bash
    PORT=3002
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=password
    DB_NAME=db_photoPond
    SALT_ROUNDS=10
    NODE_ENV=production
    secretOrKey=yoursecretkeyishere
   ```

1. Set up the database:
    - Use the SQL scripts in table.txt to create the necessary tables.
    
1. Start the server:
   ```bash
   npm run dev
   ```
1. Open the application in your browser
   ```bash
    http://localhost:3002
   ```

### API Endpoints

Authentication

    - POST /auth/login - Login a user.
    - POST /auth/register - Register a new user.
User

    - GET /user/:id - Get user details by ID.
    - POST /user/profile - Upload a profile picture.
    - PUT /user/:id - Update user details.
    
Images

    - GET /image/ - Get all images.
    - POST /image/ - Upload a new image.
    - DELETE /image/:id - Delete an image.
    
Comments

    - GET /comment/:id - Get comments for an image.
    - POST /comment/ - Add a comment.
    
Likes

    - GET /like/:imageId - Get likes for an image.
    - POST /like/add/ - Add a like.
    - DELETE /like/remove/ - Remove a like.
    
License
This project is licensed under the ISC License.
Acknowledgments
- FontAwesome for icons.
- Express.js for backend framework.
- MySQL for database management.

  <img src="https://github.com/bishwasshrestha/PhotoPond/blob/main/demo/photopond1.gif" height="540"/>
  




