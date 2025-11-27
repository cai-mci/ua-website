
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 

//routes

const routes = require('./server/routes.js');
const authRouter = require('./server/auth.js');
const animalReadRouter = require('./server/animalData.js'); 
const animalEditsRouter = require('./server/animalEdits.js');

app.use('/', routes); 
app.use('/admin', authRouter); 
app.use('/view', animalReadRouter);
app.use('/animals', animalEditsRouter);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});