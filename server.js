// server.js
const express = require('express');
const app = express();

const path = require('path'); //lets us use dirname
app.use(express.static(path.join(__dirname, 'public'))); //allows access to everything in public

// const animals = require('./public/animals');
app.use(express.static('public'));
const bcrypt = require('bcrypt');

app.use(express.json()) //allows to use json

const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = "https://pijsxjlqxeqanknogalx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpanN4amxxeGVxYW5rbm9nYWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTQ3MjUsImV4cCI6MjA3NzA5MDcyNX0.-UTF0fw7eBQZFlFK5H9FPy6FCiAwDBjj3oAM-lXfyEg";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log('Server running on http://localhost:3000');
});

app.post('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// app.post('/admin/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'admin.html'));
  
// })



app.post('/admin/login', async (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;

    console.log("Username:", username);
    console.log("Password:", password);


    const { data, error } = await supabase
        .from("admin")
        .select('*')
        .eq('username', username)
        .single(); //find user in db
    

    if (error) { return res.status(500).send('Database error'); } 

    //can't find user
    if (!data) { return res.sendStatus(404); }

    //can find user
    try {
        //will hash inital password (with salt gotten from req.body password)
        //returns true if same
        // if (await bcrypt.compare(password, data.password)) {
        if (password == data.password) {
            console.log('console - Success')
            res.status(200).send('Success'); 
        } else {
            res.status(401).send('Wrong Password')
        }
        
        
    } catch {
        console.log('Failed comparing')
        res.status(501).send('Failed comparing passwords')
    }
})


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.get('/adopt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adopt.html'));
});

//individual animal (want this to be the id??)
app.get('/adopt/detail', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'animaldetail.html'));
});

app.get('/foster', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'foster.html'));
});






