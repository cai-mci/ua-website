const express = require('express');
const router = express.Router();
const path = require('path');



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


router.get('/admin', (req, res) => serveHtml('login.html', req, res));

//ADMIN ROUTES
const requireAdmin = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    
    return res.redirect('/admin');
};


router.get('/admin/home', requireAdmin, (req, res) => serveAdminHtml('admin.html', req, res));
router.get('/admin/add', requireAdmin, (req, res) => serveAdminHtml('addanimal.html', req, res));
router.get('/admin/remove', requireAdmin, (req, res) => serveAdminHtml('removeanimal.html', req, res));
router.get('/admin/edit', requireAdmin, (req, res) => serveAdminHtml('editanimal.html', req, res));



module.exports = router;