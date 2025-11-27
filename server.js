
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 
// app.use(express.urlencoded({ extended: true }));

//session
app.use(session({
    secret: 'a_very_secret_key_that_should_be_long_and_random', 
    resave: false, 
    saveUninitialized: false, // Don't create session until something is stored
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // Session lasts 24 hours
        secure: process.env.NODE_ENV === 'production' 
    }
}));

//routes

const routes = require('./server/routes.js');
const authRouter = require('./server/auth.js');
const animalReadRouter = require('./server/animalData.js'); 
const animalEditsRouter = require('./server/animalEdits.js');

app.use('/', routes); 
app.use('/admin', authRouter); 
app.use('/view', animalReadRouter);
app.use('/animals', animalEditsRouter);


app.use((req, res) => {
    res.status(404).send("404 Not Found");
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});