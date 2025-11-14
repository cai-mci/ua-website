// server.js
const express = require('express');
const app = express();

const path = require('path'); //lets us use dirname
app.use(express.static(path.join(__dirname, 'public'))); //allows access to everything in public

const animals = require('./public/animals');
app.use(express.static('public'));
const bcrypt = require('bcrypt');

app.use(express.json()) //allows to use json

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log('Server running on http://localhost:3000');
});

app.post('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.post('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
})

const users = ["hi"]



app.post('/users', async (req, res)=> {
    try {
        //get salt -> means same passwords hash differently
        const salt = await bcrypt.genSalt()
        //use that salt to create hashed password
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        //create user
        const user = { name: req.body.name, password: hashedPassword }

        //saving it to db
        users.push(user)
        //st resposne status to 201 and send a blank response to user
        res.status(201).send()
    } catch {
        res.status(500).send('Could not add new user')
    }

})

app.post('/users/login', async (req, res) =>{
    const user = users.find(user => user.name == req.body.name)
    //can't find user
    console.log(user.name)
    if (user == null) {
        return res.sendStatus(400).send('Cannot find user')
    }
    //can find user
    try {
        //will hash inital password (with salt gotten from req.body password)
        //returns true if same
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.send('Sucess')
        } else {
            res.send('Wrong Password')
        }
        
    } catch {
        res.status(500).send('Failed comparing passwords')
    }
})

app.get('/users', (req, res) => {
    res.json(users)
}) //gets all users