// figure out which set of credentials to return
if (process.env.NODE_ENV === 'production') {
    // production - return prod keys
    module.exports = require('./prod');
} else {
    // development - return dev keys
    module.exports = require('./dev');  // pass back the dev.js immediately
}