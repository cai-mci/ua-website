const express = require('express');
const router = express.Router(); // Use Router instead of the main app object

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
        const data = await getAnimal(animalId);   
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve animal details from database.' });
    }
});




module.exports = router;