const express = require('express');
const router = express.Router(); 

const {getAnimal, getAnimals} = require('./dataOperations.js');


//adopt page: show all animals (with optional filters)
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

router.get('/animals/adoptable', async (req, res) => { 
    try {
        const data = await getAnimals({'adoptable': true});

        res.status(200).json({ success: true, count: data.length, data: data });
    } catch (error) {
        console.error('API Fetch Error:', error);
        res.status(500).json({ error: 'Failed to fetch animals from database.' });
    }
});



//animal details page: get a single animal by id
router.get('/animal/:id', async (req, res) => {
    const animalId = req.params.id; 

    try {
        const data = await getAnimal(animalId);   
        res.status(200).json(data);

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to retrieve animal details from database.' });
    }
});

module.exports = router;