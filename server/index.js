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