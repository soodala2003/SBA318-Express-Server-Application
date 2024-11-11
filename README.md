# SBA318-Express-Server-Application
https://github.com/soodala2003/SBA318-Express-Server-Application.git

This is the repository for a small Node and Express server  application. It allows users to get their data, to create a post, to manipulate their data, and to delete their data. 

1. Home page: "http://localhost:3000"
- Click on the button of "Data": to move to Data page 

2. Data page: "http://localhost:3000/api"
- Users section: 
    - "GET" button to retrieve all users ("http://localhost:3000/api/users")
    - "POST" button to create a user 
- Posts section: 
    - "GET" button to retrieve all posts ("http://localhost:3000/api/posts")
    - "POST" button to create a post
    - "FILTER" button to retrieve all posts by a user with the specified postId ("http://localhost:3000/api/posts?userId=VALUE") 
- Comments section: 
    - "GET" button to retrieve all comments ("http://localhost:3000/api/comments")
    - "POST" button to create a comment 

3. All Users Data page: "http://localhost:3000/api/users"
- Hover the mouse on the "GET" button, and then click one user ID to move to pages that reteives each user's data
    - User ID: 1 ("http://localhost:3000/api/users/1") 
    - User ID: 2 ("http://localhost:3000/api/users/2") 
    - User ID: 3 ("http://localhost:3000/api/users/3") 

4. User ID page
- This page shows each user's data
- "PATCH" button to update a user's detail
- "DELETE" button to delete a user's detail

5. API's abailable routes:
- "http://localhost:3000/api/users/:id/posts" : retrieves all posts by a user with the specified id
- "http://localhost:3000/api/users/:id/comments" : retrieves comments made by the user with the specified id


