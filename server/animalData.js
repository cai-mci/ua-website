const express = require('express');
const router = express.Router(); // Use Router instead of the main app object
const { supabase } = require('./database.js'); // Adjust path as needed

// Define the route logic
router.get('/', async (req, res) => { // Route is now just '/' because of how it's used below
    try {
        const { data, error } = await supabase
            .from("animals")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('API Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch animals from database.' });
    }
});

module.exports = router;