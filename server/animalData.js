const express = require('express');
const router = express.Router(); // Use Router instead of the main app object
const { supabase } = require('./database.js'); // Adjust path as needed
const {getAnimal, getAnimals} = require('./dataOperations.js');

router.get('/animals', async (req, res) => { 
    try {
        const filters = req.query;
        const data = await getAnimals(filters);

        res.status(200).json({ success: true, count: data.length, data: data });
    } catch (error) {
        console.error('API Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch animals from database.' });
    }
});


router.get('/animal/:id', async (req, res) => {
    const animalId = req.params.id; // Extract the ID from the URL path

    try {
        const { data, error } = await supabase
            .from("animals")
            .select("*")
            .eq("id", animalId) // Use the ID from the URL parameter
            .single();

        if (error) {
            // Check for the "No rows found" error specific to .single()
            if (error.code === 'PGRST116') {
                return res.status(404).json(null); // Return 404 if record doesn't exist
            }
            console.error("Database Error:", error);
            throw error;
        }
        
        // Success: Send the single animal object as JSON
        res.status(200).json(data);

    } catch (apiError) {
        console.error('API Fetch Error:', apiError);
        res.status(500).json({ error: 'Failed to retrieve animal details from database.' });
    }
});




module.exports = router;