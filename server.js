
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

//routes

const routes = require('./server/routes.js');
const authRouter = require('./server/auth.js');
const animalsRouter = require('./server/animalData.js'); 

app.use('/', routes); 
app.use('/admin', authRouter); 
app.use('/api', animalsRouter);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});