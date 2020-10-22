const express = require('express');

// Create the first Express application
// It represents a running Express app
// The app is used to setup configuration that will listen for incoming request from Node, then pass on to Route Handler
const app = express();

/**
 * go to diagrams\App-overview-diagrams.xml
 * 001 - request types
 * app.get is calling a brand new route handler
 */
app.get('/', (req, res) => {
    res.send({
        hi: 'there',
        hello: 'world'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);