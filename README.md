# Pick The Fit

A fashion application where users can manage their personalized digital closet. 

---

## Project Description
- User signup with secure password hashing
- User login with credential validation
- Users have a "Home" page that displays the following:
        - User's profile info (bio, profile picture, name)
        - The User's posts; Clicking on a post opens a "Comments" sidebar
        - Each post has clickable like and dislike buttons
        - Lists of the user's followers and following
        - A button to the user's closet
        - Edit buttons for the bio and profile picture
        - A Logout button

- The "Followers" sidebar displays:
        - A list of all of the Users followers
        - A "Suggested" list underneath of the recommended users to follow; includes a "follow" button next to each suggested name
        - A search bar at the top that allows users to search for other users to follow; includes a "follow" button next to each search result
        - Clicking a name from the list of followers navigates to the follower's home page

- A follower's home page displays:
        - The follower's name, bio, profile picture, number of followers/following
        - The follower's posts; clicking on the post opens a "Comments" sidebar
        - Each post has clickable like and dislike buttons
        - A "Back to Home" button that navigates back to the logged-in user's home page

- The "Comments" sidebar displays:
        - The name of the commenter and the text of each comment
        - A "Reply" button next to each comment
        - A "Post" button to post a new comment
        - A "Delete" button to delete any comment made by the logged-in user
     
- The "Your Closet" page displays the following:
        - A back to home button
        - All of the user's clothing organized by group (shirts, pants, etc...)
        - An upload button to allow users to upload new clothing
        - A create an outfit button to allow users to assemble their outfits

- The "Your Outfit" page displays the following:
        - The clothing selected by the user; stacked by top, bottom, shoes
        - A "Cancel" button to discard the outfit
        - A "Create a Post" button to allow the user to write the title and description of the post
        - A "Back to Home" button

# Tools

## Frontend
- React.js
- React Router DOM
- JavaScript
- HTML/CSS

## Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- bcrypt 
- CORS

## Deployment steps
1. git clone repository
2. navigate to backend directory; run npm install
3. run: npm run dev
4. navigate to frontend directory; run npm install
5. run: npm run dev
6. open the local host link
