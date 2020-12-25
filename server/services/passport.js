const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const keys = require('../config/keys');

const User = mongoose.model('users');   // pulling the schema from mongoose. In this case, no need to export User.js here as it is stored in mongoose

passport.serializeUser((user, done) => {    // turn mongoose model instance to user.id
    done(null, user.id);
});

passport.deserializeUser((id, done) => {    // turn user.id back to mongoose model instance
    User.findById(id)   // return the user model instance
        .then(user => {
            done(null, user);
        })
});

passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, (accessToken, refreshToken, profile, done) => {
        // Before creating new User, check if the user exists in our database first.
        User.findOne({ googleId: profile.id })
            .then((existingUser) => {
                if (existingUser) {
                    console.log("User already exists");
                    done(null, existingUser); // finish the callback
                } else {
                    new User({ googleId: profile.id })
                        .save()  // create a Model Instance, then save to mongoDB
                        .then(user => done(null, user));    // This done, 'user' would be passed to serializeUser(user). It is the user record in our database
                }
            });
        // let existingUser = await User.findOne({ googleId: profile.id });
        // if (!existingUser) {
        //     let user = await new User({ googleId: profile.id }).save();
        //     done(null, user);
        // } else {
        //     console.log("User already exists");
        //     done(null, existingUser);
        // }
    })
);
