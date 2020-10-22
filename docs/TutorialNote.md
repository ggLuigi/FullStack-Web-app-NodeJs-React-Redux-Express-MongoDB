## Server side architecture

### Glossary
---
* **package.json**: define the dependencies of all npm packages
* **Node**: Let *Javascript runtime* to execute code outside of the browser (more on the backend side)
  * Javascript normally is used inside the browser
* **Express**: A library with a collection of helper methods to make writing servers / deal with HTTP traffic easier
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


### Deployment
diagrams\App-overview-diagrams.xml 
-> 017 - heroku deployment
-> 016 - deployment
Using Heroku to deploy the app.
It will have dynamic port binding as it can have multiple app to run in a single maching. When it deploys, it will set the environment variable PORT.

It finds the node and npm version before deploying the app (inside *package.json*)
Indicate the start command in *package.json* "scripts" -> start **index.js**

Heroku uses Git based deployment procedure
