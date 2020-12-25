const passport = require('passport');

module.exports = (app) => {
    app.get(
        '/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email']
        })
    );

    app.get(
        '/auth/google/callback',
        passport.authenticate('google')
    );

    app.get('/api/logout', (req, res) => {
        req.logout();   // passport has made this feature to take cookie and kill the ID in the passport
        res.send(req.user);
    })

    app.get('/api/current_user', (req, res) => {
        res.send({
            session: req.session,
            user: req.user
        });
        // res.send(req.user); // this link will fetch the cookie and respond with the logined user info
    })
}