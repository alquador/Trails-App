# National Parks
An application that allows users to currently search National Parks by state code.  There are more versions and functionality to come!  I would love to incorporate a hiking trail API in conjunction with the National Park API. Thank you to the National Park Services API information provided and powering my app!

# Installation Instructions
1. Clone this repository.
2. Navigate into the trails-app folder.
3. Run touch .env .gitignore in the main project directory(same level as server.js).
4. Add node_modules and .env into the .gitignore folder.
5. Install dependencies with npm install.
6. Ensure that you have nodemon installed by running npm install -g nodemon.
7. Enter the command nodemon to start server.
7. Signup for an API key through the National Park Services and retrieve a unique API key.
8. Inside the .env folder assign the unique API key to a variable.
9. Navigate to https://localhost:3000
10. Signup or login to an account to continue into the app.

# CRUD Functionality


| VERB | URL Pattern | ACTION |      DESCRIPTION      |  MODEL |  
| :--- |    :----:   |   ---: |         ---:          |  ---:  |
| GET  |   /parks    |  Index |  Retrieve Park Index  |  Park  |
| GET  | /parks/mine | Index  | User's favorited parks|  Park  |

![alt text](/Trails%20(1).jpg)

![alt text](/Trail%20ERD%20-%20Salesforce%20schema%20import%20(ERD)%20(1).jpeg)

### User Story
The user will be able to go to a home page that allows them to enter a state code of National Parks they would like to visit.  From the home page they are directed to the index page where a list of National Parks near the zip code are populated.  The user can then click on a specific National Park to view its specific show page, and add it to their "Favorite Parks Page".  Once on the show page the user will be able to post a comment related to the National Park and delete a comment. There is also a "Visit counter" that will allow a user to increment visits relative to their amoun of visits.
