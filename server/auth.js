
const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt'); 

const { getUser } = require('./dataOperations.js');

// POST /admin/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    // console.log(username);
    // console.log(password);

    if (!username || !password) {

        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    try {
        const user = await getUser(username);
        // console.log(user.username);
        // console.log(user.password);

        if (!user) { 
            return res.status(404).send('User not found'); 
        }


        if (password === user.password) {
            // console.log(`Login Success for: ${username}`);
            res.status(200).send('Success'); 
        } else {
            res.status(401).send('Wrong Password');
        }
    } catch (dbError) {
        console.error("Login attempt failed due to DB error:", dbError);
        res.status(500).send('Database error during login check');
    }
});

module.exports = router;