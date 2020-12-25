# Node with React: Fullstack Web Development
FullStack-Web-app-NodeJs-React-Redux-Express-MongoDB
The course from Udemy: https://harmonic-owlstars.udemy.com/course/node-with-react-fullstack-web-development/learn/lecture/7593644#overview


It is a feedback collection app for users.
It helps user to send email to their customers to collect feedback, then gather the feedback and update the app.


1. Sign up via Google OAuth
2. User pays for email
3. User creates a new 'campaign'/survey
4. User provides a list of emails
5. The app helps send out emails
6. Customers answer the survey
7. App tabulates feedback
8. User can see report of survey responses

## Development

### Server side

It uses: 
* NodeJS, Express to handle HTTP traffic
* Heroku to deploy the application (with the aid of git) -> The heroku server link: https://aqueous-sands-83722.herokuapp.com/
* Google OAuth to handle account
* Passport JS with passport-google-oauth20 to help with google oauth setup for our setup to obtain users' profile and email for registration
* Nodemon npm package to help with automatically update the local server for changes
* MongoDB is our database choice. Mongoose library is used to connect MongoDB that hosted on Atlas.
* Cookie-session npm package is used to extract cookie data