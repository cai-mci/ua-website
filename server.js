
const express = require('express');
const session = require('express-session');
const path = require('path');
const app = express();

const multer  = require('multer');//for image uploads
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




//image uploading

// Set up multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/animal/'); // folder to save files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  }
});
const upload = multer({ storage: storage });


// Handle file upload
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.send('No file uploaded!');
  res.send(`File uploaded successfully: ${req.file.filename}`);
});


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


