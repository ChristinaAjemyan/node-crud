// Import the packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

// Create an instance for express
const app = express();

// Get the person routes
const person = require('./routes/person');
const project = require('./routes/project');
const auth = require('./routes/auth');
const Role = require("./models/Role");
const verifySignUp = require("./middlewares/verifySignUp.middleware");

// Apply the bodyParser middleware, to get json data from requests (Body)
app.use(bodyParser.json());

app.use(cors())
app.use(function (_, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});

// Apply the routes of auth
app.use(
    "/api/auth",
    auth
);

// Apply the routes of /api/person
app.use('/api/person', person);
app.use('/api/project', project);

const initial = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'user' to roles collection");
            });
            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'admin' to roles collection");
            });
        }
    });
}

// Connecting with database
mongoose
    .connect('mongodb://localhost:27017/nodeCrud', {useNewUrlParser: true})
    // If all run ok, console log the message
    .then(() => {
        initial();
        console.log('MongoDB connected')
    })
    // For console log any error
    .catch(err => console.log(err));

// Port declaration
const port = process.env.PORT || 9000;

// Init the express.js server
app.listen(port, () => console.log(`Server running on ${port}`));
