## Server side architecture

### Glossary
---
* **package.json**: define the dependencies of all npm packages
* **Node**: Let *Javascript runtime* to execute code outside of the browser (more on the backend side)
  * Javascript normally is used inside the browser
* **Express**: A library with a collection of helper methods to make writing servers / deal with HTTP traffic easier. diagram/02/diagram.xml
-> *(Diag: 000 - express requests)*
---

When you start a server on your local machine, it is required to open port on your machine for listening incoming HTTP request.

**Configure** Node and Express to listen to traffic that is requesting to access a specific port of the local machine

Node **is** the module that takes in the HTTP traffic and hands over to Express to handle it.  
Node is **needed**. Express is **NOT required** but it has helper functions to handle request *easier*.

In Express, we write **Route Handler** to handle the request that are asking for specific services, e.g.
* Authenticating user
* Logging out user
* Create / save survey
Then it processes the request and returns a Response, and routes to Node (running node process), send back to responsible port.

---
### Code:

Express:
Calling and register the Route Handler to `app`
```js
app.get()
```

```js
app.get() // to make a get request to the route
app.post()  // make a post request ..
app.put()
app.delete()
app.patch()
```

To define route/url path:
```js
app.get('/');
app.get('/data/');
app.get('/login');
```

Request: `req` - a request to give info of who is making the request and the request payload
Response: `res` - a response to send back to who made request
`res.send()` gives the response data

---
### Deployment
To deploy the application for other can be used. It has the server that host your application.

It uses Heroku.

-> *(Diag: 02/diagrams.xml/017 - heroku deployment)*
-> *(Diag: 02/diagrams.xml/016 - deployment)*
Using Heroku to deploy the app.
It will have dynamic port binding as it can have multiple app to run in a single maching. When it deploys, it will set the environment variable PORT.

It finds the node and npm version before deploying the app (inside *package.json*)
Indicate the start command in *package.json* "scripts" -> start **index.js**

Heroku uses **Git based** deployment procedure
### First deployment
in package.json, "scripts" would define the application start script
```js
"scripts": {
  "start": "node index.js",
},
```
1. Login to the heroku cli
   `heroku login`
2. Create new app
   `heroku create`
   will give you a url that has a generated name of you app
   The git link is our deployment target, push our local git to the heroku git server
   https://aqueous-sands-83722.herokuapp.com/ | https://git.heroku.com/aqueous-sands-83722.git
3. To push the git repo to the heroku git server
   ```bash
   git remote add heroku https://git.heroku.com/aqueous-sands-83722.git
   git push heroku main    // building the app  'git push <remote origin> <branch>'
   heroku open     // open the app url
   heroku logs     // show the building app logs
   ```

#### For updated Subsequest deployment
* `git commit`
* `git push heroku main`

#### For debugging deployment
`heroku logs` check if there are anything go wrong

For JSON viewer web plugin:
[Edge browser - Seven JSON Viewer](https://microsoftedge.microsoft.com/addons/detail/seven-json-viewer/khfhokalnpdlmmfjocjgaaipenplemjo)

---
### Google OAuth for authenticating account
Big picture of the Google OAuth between Client, Server and Google
-> *(Diag: 02/diagrams.xml/003 - oauth)*
-> *(Diag: 02/diagrams.xml/003.5 - Passport JS responsibilities)*
It allows user to sign up/sign in with Google Account
Other examples:
* Facebook
* Twitter
* Github

Passport JS -> a helper library for OAuth. It automates most of the authenication flow.
Cons of Passport JS: 1) It does not automates the entire thing. 2) There are actually 2 components from Passport JS: passport, passport strategy (at least 1 strategy from specific authencation provider e.g. Google, Email, Facebook, etc). *(Diag: 02/diagrams.xml/005 - passport)*

To install the passport js and strategy
```bash
npm install --save passport passport-google-oauth20
```
To search for strategy: http://www.passportjs.org/ -> http://www.passportjs.org/packages/


1. Setup the Passport JS
2. sfs
   ```js
   // create new instance of Google Passport Strategy, prompt to inform application to use Google Auth
   // passport.use -> tell passport to use this strategy of google auth
   passport.use(new GoogleStrategy({
     clientID: keys.googleClientID,
     clientSecret: keys.googleClientSecret,
     callbackURL: '/auth/google/callback'
   }));
   ```
   *(Diag: 02/diagrams.xml/003.5 - passport responsibilities)*
   The `callbackURL` is the url that provided to Google when google server has granted permission to our application. After that, it will direct the user to this callbackURL, our server will handle it with route handler.
   
3. Need to obtain Client ID, Client Secret by signing up Google OAuth API https://console.cloud.google.com. Enable the API on APIs & Services -> OAuth consent screen -> External -> Create -> Fill out "Application Name" and emails -> Save...  
Then go to "Credentials" page -> "CREATE CREDENTIALS" -> "OAuth client ID" -> Application type: "Web Application" (Require its own credential for every platform) -> Authorized JavaScript origins: http://localhost:5000 -> Authorized redirect URIs: http://localhost:5000/auth/google/callback -> Copy and store the ID and Secret
1. Passport JS identify this 'google' keywords and it will use the GoogleStrategy we defined when this below is called.
   ```js
   passport.authenticate('google', {
     scope: ['profile', 'email']  // The permission is asked for. These are specific keys
   })
   ``` 

* ClientID: Public token. ClientSecret: Private token
---
#### How to securely store your
*(Diag: 02/diagram.xml/018 - secrets)*
To store your client ID and secret on a separate file. E.g. config/keys.js
```js
module.exports = {
    googleClientID: 'xxx',
    googleClientSecret: 'xxx'
}
```
add the file to .gitignore

---

5. The google oauth login page
   ![Image](googleOauth%20page.png)
   ![Image](googleOauth%20page_1.png)
6. The direct url would be: 
   * https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?
   * **response_type**=code&  
   * **redirect_uri**=http%3A%2F%2Flocalhost%3A5000%2Fauth%2Fgoogle%2Fcallback& 
   * **scope**=profile%20email&  
   * **client_id**=823326145498-div0nl6a23umsiv8je669q6eh5e2rtqg.apps.googleusercontent.com&  
   * **flowName**=GeneralOAuthFlow  
This could be hacker-prone -> if someone could just change the **redirect_uri** to their own server and get the client_id from a pronoun company to pretend they are trustworthy application, e.g. pretend to be airbnb server.
   * So google has to match the **redirect_uri** with your registered redirect_uri on google console API

7. Handle the callback with route handler with the url "code" value. E.g. http://localhost:5000/auth/google/callback?
   **code**=4%2F0AY0exxxxxxxxxx_WwK7BetFmiw&
   scope=email+profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&
   authuser=3&prompt=consent#
   
8. Passport then passes code from the url back to Google with the exchange of user's profile and email

9. Access Token: A token that reach back to Google or the auth server that you have granted this user info to our application
10. Refresh Token: Allow us to refresh the access token. Where the access token expires after some amount of time.

* To keep the server update according to our change without stopping and restarting the server. Nodemon -> `npm install --save nodemon`
* To start the server up 
  ```bash
  nodemon index.js
  ```
  ```js
  // Or add the shortcut script in package.json
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js",
  },
  // run 
  npm run dev
  ```

11. Organise the project on folder structure. *(Diag: 02/diagram.xml/020 - server refactor)*

The index.js would be:
```js
const express = require('express');

require('./services/passport');  // It is not returning anything, just require it.


// Create the first Express application
// It represents a running Express app
// The app is used to setup configuration that will listen for incoming request from Node, then pass on to Route Handler
const app = express();

require('./routes/authRoutes')(app);    // Get the function returned from authRoutes and immediately call the function with app param.
/**
 * go to diagrams\App-overview-diagrams.xml
 * 001 - request types
 * app.get is calling a brand new route handler
 */
// app.get('/', (req, res) => {
//     res.send({
//         hi: 'there',
//         hello: 'world'
//     });
// });

const PORT = process.env.PORT || 5000;  // for heroku to find the PORT
app.listen(PORT);
```
### Authentication
Bottom half of *(Diag: 02/diagrams.xml/003.5 - Passport JS responsibilities)*
* HTTP request (or AJAX request) is stateless. *(Diag: 02/diagrams.xml/009 - sessions)* No way to identify 2 different request. As information between 2 requests are not shared.
* Cookies *(Diag: 02/diagrams.xml/010 - cookies)*: The token or cookie that received from the server, it can help identify the user. This token is then passed along with the next request to the server for identification
* The server or our application would generate unique token and return the response with a header (has a property: Set-Cookie for asking to set the unique token) to the browser.  
  The browser then strips off the token and stores in the browser memory. It attached this cookie token as a header whenever this browser sends request to the server later time.
  **Cookie-based Authentication**
* Email-password authentication *(Diag: 02/diagrams.xml/021 - oauth identity)*: Runs before the token and cookie. (The login part). When user sign up and register, server should store the email and password somewhere in DataBase, then next time they sign in again, server would VALIDATE the database info and its email/password, afterall it runs through the cookie thing.
* OAuth Flow: By validating consistent & unique keys of user google 'profile'. (e.g. user ID). This key should not be changed. And we trust this third party authentication provider.
* *(Diag: 02/diagrams.xml/011.5 - purpose of DB)*: how does the login process relate to the database
---
### MongoDB and mongoose

Mongoose
*(Diag: 02/diagrams.xml/006 - mongoose)*
The mongoose.js helps with working with MongoDB
*(Diag: 02/diagrams.xml/006 - mongoose mongo)*

MongoDB 
* A database instance has different collections, each collection contains many records
* is a schemaless Database, inside a single collection, every record can have its **OWN DISTINCT** set of properties.

*(Diag: 02/diagrams.xml/007 - model instance)*
How mongoose relates to MongoDB.
| mongoose                                   | MongoDB              |
| ------------------------------------------ | -------------------- |
| A model class                              | A collection         |
| Within model class, we have model instance | record of collection |

*(Diag: 02/diagrams.xml/022 - db location)*
There are 2 way to setup mongoDB database. 1) install local copy of the database on your local machine. 2) use a remote hosted instance of mongoDB
MongoDB Atlas

MongoDB -> Create Project -> "FeedbackCollectorApp" -> Create free cluster (name: feedback-Cluster1) -> "CONNECT" to the cluster -> whitelist your address "Add Your Current IP Address" -> create database admin user -> "Connect your application" -> copy the connection string -> put those to your config/keys.js

```js
mongoURI: 'mongodb+srv://<username>:<password>@<clustername>.xro7q.mongodb.net/<dbname>?retryWrites=true&w=majority',
```
To add records or colelction or database in your database:
go to your cluster -> Collections tab -> Add My Own Data

Connect the mongoDB on your machine using mongoose
`npm install --save mongoose

To connect the mongoDB SRV with this uri
```js
mongoose.connect(keys.mongoURI);
```

Describing mongoose and how it is related to this application:
*(Diag: 02/diagrams.xml/023 - needs)*
1. MongoDB is created
2. We connect that mongoDB to our application with Mongoose library
3. Database is needed to store user records for authentication

Create a Model Class that represents Collection
`models/` will store all the data
User.js

`Schema`: describe what properties are there in inidividual record ahead.
```js
const userSchema = new Schema({
   googleId: String,
});
mongoose.model('users', userSchema);
// mongoose.model(CollectionName, SchemaName);
```

* Save the model instance to the mongDB database:
  ```js
  const User = mongoose.model('user');
  new User({
     googleId: profile.id,
  }).save();
  ```

* Query with mongoose
  ```js
  User.findOne({ googleId: profile.id }); // it is a promise
  ```

* *(Diag: 02/diagrams.xml/026 - serialize)*: Set cookies to the browser after the done() callback
* Serialize User to generate token that identify user.
* De-serialize User when the same browser use that token as header for request
* We need to tell passport, we are using cookie to run these serialization and authentication
* *(Diag: 02/diagrams.xml/015 - session to user)*: The request flow
* To Logout -> the passport will take the cookie and kills the ID.
* The cookie-session, express, passport are middlewares. 
* *(Diag: 02/diagrams.xml/004 - express app)*: The middleware works before the route handler after the request is fed to the app. Then the route handler would handle and return the response
* CookieSession:
  ```js
  cookieSession({
     maxAge: 30 * 24 * 60 * 60 * 1000,   // 30 days in ms
     keys: [keys.cookieKey]   // encrypt the cookies with the key
  })
  ```
  `res.send(req.session);` -> The cookie-session extracts data from cookie and assign it to `req.session` = the data that passport stored in cookie. Then the passport will get user info from `req.session` and deserialized it.

* cookie-session and express-session: *(Diag: 02/diagrams.xml/012 - session stores)* 
* For express-session: *(Diag: 02/diagrams.xml/014 - cookie store)*, the session will be stored in MongoDB
* cookie-session stores everything inside cookie, express-session stores info outside the cookie but only session id for mapping
* express-session can stores bigger amount of data
* cookie-session only stores up to 4KB data
* To check cookie session on browser ->   
  ![cookie on browser](./cookie_1.png)


---
Dev vs Prod
*(Diag: 02/diagrams.xml/028 - dev vs prod)*
2 sets of keys for mongoDB, GoogleAPI, Cookie Key
* For Production, we can store Production keys on Heroku server
* For Development, keep it in personal local machine
* For keeping Development keys in personal local machine can prevent someone has access on these keys. If someone has access to it, you can delete this keys database.
* It has 2 sets of MongoDB database. It provides a testing playground without having a risk to break the users Production data

*(Diag: 02/diagrams.xml/018 - secrets)*
How to deal with keys.js for both Dev and Prod
MongoDB credential: admin-prod-ggluigi / SbGUqHPWLf9sqz6M
mongodb+srv://admin-prod-ggluigi:SbGUqHPWLf9sqz6M@alui-cluster1.o7xkj.mongodb.net/prodDataBase?retryWrites=true&w=majority
google: 702089350345-8jb2545aub4gesslgng8io0him457b6b.apps.googleusercontent.com
_sHswT9xoZzhk0Hr_leed5VR


### For setting up Production environment
1. Go to MongoDB Atlas to create new project and setup the same but with different admin username/password.
2. Go to Google console page, setup new project, and set up similar but only different OAuth client ID URIs. -> Has to set to Heroku URIs.
3. To find heroku app URI -> go to our terminal, type `heroku open`. It opens the browser with the app url.
4. Authorized JavaScript origins -> <url>
5. Authorized redirect URIs -> <url>/auth/google/callback

`config/keys.js` only contains the logic to determine which set of keys to use. Will not contain any keys
And now to determine which sets of keys.
node has a env key to know if it is production -> `process.env.NODE_ENV` === 'production'
`config/dev.js` -> actual development keys !! Do not commit this !!
`config/prod.js` -> storing all production keys

To add environment keys in Heroku: https://devcenter.heroku.com/articles/config-vars
-> go to 'heroku.com' -> login and go to your project -> 'Settings' -> scroll to 'Config Vars' -> 'Reveal Config Vars'