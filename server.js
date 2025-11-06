// server.js
const express = require('express');
const path = require('path');
const animals = require('./public/animals');

const app = express();
const port = 3000;

// handle JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// public = root directory for website 
app.use(express.static(path.join(__dirname, 'public')));

// Use  animals routes
app.use('/api/animals', animals);


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log('Server running on http://localhost:${port}');
});
