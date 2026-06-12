# Pick The Fit

A fashion application where users can manage their personalized digital closet.  

---

## Project Description

- Our project includes user signup with secure password hashing, user login with credential validation, a user "Home" page that displays user's profile info (bio, profile picture, name), and user's posts. Clicking on a post opens a "Comments" sidebar and each post has clickable like and dislike buttons. The home page also features a list of the user's followers and following, button to the user's closet, logout button, and edit buttons for the bio and profile picture. 

- The "Followers" sidebar displays a list of all of the users followers, "Suggested" list underneath to recommended other users to follow with a follow button next to each suggested name. A search bar at the top that allows users to search for other users to follow with the follow button next to each search result. Clicking a name from the list of followers navigates to the follower's home page

- A follower's home page displays the follower's name, bio, profile picture, number of followers/following. It also has the follower's posts where clicking on the post opens a "Comments" sidebar. Each post has clickable like and dislike buttons and A "Back to Home" button that navigates back to the logged-in user's home page. 

- The "Comments" sidebar displays the name of the commenter and the text of each comment, a "Reply" button next to each comment, a "Post" button to post a new comment, and a "Delete" button to delete any comment made by the logged-in user.
     
- The "Your Closet" page displays a back to home button, all of the user's clothing organized by group (shirts, pants, shoes, etc...), an upload button to allow users to upload new clothing, and a create an outfit button to allow users to assemble their outfits.

- The "Your Outfit" page displays the following the clothing selected by the user (stacked by top, bottom, shoes), a "Cancel" button to discard the outfit, a "Create a Post" button to allow the user to write the title and description of the post, and a "Back to Home" button.
  
- Admin Page: Admin can see a list of all the current users in the system, their profiles, posts, followers/following. Admin can delete users.

## Future Extensions to Project

- Easier to upload clothes. Using AI or other tools to automatically crop the image background and enhance the image.
- Mannequin/Virtual Try-On. Allow users to drag clothes to a replica of themselves on the app with accurate fitting and body dimensions. Have a virtual try-on where users can record themselves and see the digital clothes on their body.   

## Tools

Frontend: React.js, React Router DOM, JavaScript, HTML/CSS
Backend: Node.js, Express.js, MongoDB + Mongoose, bcrypt, CORS

## Deployment steps
1. git clone repository
2. navigate to backend directory; run: npm install
3. run: npm run dev
4. navigate to frontend directory; run: npm install
5. run: npm run dev
6. open the local host link
