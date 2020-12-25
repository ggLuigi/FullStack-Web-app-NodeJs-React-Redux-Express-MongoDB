const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');

require('./models/User');   // define the User schema first
require('./services/passport');  // It is not returning anything, just require it.
const keys = require('./config/keys');

mongoose.connect(keys.mongoURI);    // Connect to mongo DB
// Create the first Express application
const app = express();

app.use(
    cookieSession({
        maxAge: 2 * 60 * 1000,   // 30 days in ms
        keys: [keys.cookieKey]   // encrypt the cookies with the key
    })
);
app.use(passport.initialize()); // initialize() to connect with express app as middleware
app.use(passport.session());    // This helps to persist the login session

require('./routes/authRoutes')(app);    // Get the function returned from authRoutes and immediately call the function with app param.

const PORT = process.env.PORT || 5000;  // for heroku to find the PORT
app.listen(PORT);