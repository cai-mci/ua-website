const { supabase } = require('./database.js'); // Adjust path as needed


// server/auth.js

const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt'); // Keep bcrypt if you switch to hashing

const { getUser } = require('./data.js');

// POST /admin/login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // 1. Find the user in the database
    try {
        const user = await getUser(username);

        if (!user) { 
            return res.status(404).send('User not found'); 
        }

        // 2. Compare passwords
        // NOTE: The original code was using direct comparison (password == data.password)
        // For security, you should use bcrypt.compare(password, user.password)
        if (password === user.password) {
            console.log(`Login Success for: ${username}`);
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