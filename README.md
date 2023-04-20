# PhotoPond   
    
  <img src="https://github.com/bishwasshrestha/PhotoPond/blob/main/demo/photopond1.gif" height="540"/>
  
# Overview
social media web page where one can upload and browse pictures from other users

# App Feature
  - login/register
  - upload images with ease.  
  - view posts from users
  - search posts from users
  - React on friend's posts.
  - Add comments to the pictures.
  - delete pictures from your gallery
  - edit your profile 
  - logout
  
# Built With 
  - Express.js - Back end web applicaton framework for NodeJS.
  - REST API - The server will transfer to the client a representation of the state of the requested resource
  - Vanilla JS - JavaScript to create CRUD operations from the DOM (Create, Read, Update, Delete).
  - Node MySQL 2 - MySQL client for Node.js which supports prepared statements, non-utf8 endcodings, binary log protocol, compression and ssl.
  - Express-JWT - Middleware for validating JWTs for authentication
  - JSON Web Token - For generating JWTs used by authentication
  - Passport - For handling user authentication

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
            


# Requirements
For development and production, you will need Node.js and npm, installed in your environement. Additionally, setup MySQL database for databse storage.

  ## Node 
  
   - Node installation    
      Go on official [Node.js](https://nodejs.org/) website and download the installer or use your linux distro specific package manager to download it. Also, be sure to have git                   available in your PATH.

  - MySQL
      MySQL installation        
        [Install](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/windows-install-archive.html)

# Getting Started

  ## Clone
    - git clone https://github.com/bishwasshrestha/PhotoPond.git    
  
  ## Setup Local Environment 
    
  Create an environment variable page (.env) with credentials to connect to the database.
        
        PORT = 3002
        DB_HOST= localhost
        DB_USER=  root
        DB_PASS=  password
        DB_NAME=  db_photoPond
        SALT_ROUNDS= 10
        NODE_ENV = production
        secretOrKey = yoursecretkeyishere
  
  Now run the following command 
  
      - npm install
      - npm run dev
      
      
    You will find you app running on localhost:3002/
