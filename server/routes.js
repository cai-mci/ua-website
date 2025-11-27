const express = require('express');
const router = express.Router();
const path = require('path');
const { insertAnimal } = require('./dataOperations.js'); 


//helper function for htnml pages
const serveHtml = (filename, req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', filename));
};

const serveAdminHtml = (filename, req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', filename));
};


//PUBLIC ROUTES
router.post('/', (req, res) => serveHtml('index.html', req, res));
router.get('/adopt', (req, res) => serveHtml('adopt.html', req, res));
router.get('/adopt/detail', (req, res) => serveHtml('animaldetail.html', req, res));
router.get('/foster', (req, res) => serveHtml('foster.html', req, res));



//ADMIN ROUTES
router.get('/admin', (req, res) => serveHtml('login.html', req, res));
router.get('/admin/home', (req, res) => serveAdminHtml('admin.html', req, res));
router.get('/admin/add', (req, res) => serveAdminHtml('addanimal.html', req, res));
router.get('/admin/remove', (req, res) => serveAdminHtml('removeanimal.html', req, res));
router.get('/admin/edit', (req, res) => serveAdminHtml('editanimal.html', req, res));



router.post('/addanimal', async (req, res) => {
    try {
        console.log("Received animal data:", req.body);
        const data = await insertAnimal(req.body); 
        res.status(200).json({ data });
    } catch (err) {
        console.error("Error inserting animal:", err);
        res.status(500).json({ error: 'Failed to insert animal into database.' });
    }
});


module.exports = router;