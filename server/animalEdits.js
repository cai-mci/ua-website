const express = require('express');
const router = express.Router(); 

const { insertAnimal,
    deleteAnimal,
    adoptAnimal,
    bringbackAnimal,
    editAnimal } = require('./dataOperations.js');


//create a new animal
router.post('/', async (req, res) => {
    try {
        const newAnimalData = req.body;
        const data = await insertAnimal(newAnimalData);

        res.status(201).json({ success: true, data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to insert animal.', error: error.message });
    }
});

//permanantely delete an animal
router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await deleteAnimal(id); 

        res.status(204).send(); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete animal.', error: error.message });
    }
});

//adopt (hide from main page) animal
router.patch('/:id/adopt', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await adoptAnimal(id);
        res.status(200).json({ success: true, message: 'Animal marked as adopted.', data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update adoption status.', error: error.message });
    }
});
//bring back (show on main page) animal
router.patch('/:id/bringback', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await bringbackAnimal(id);
        res.status(200).json({ success: true, message: 'Animal marked as adoptable again.', data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update adoption status.', error: error.message });
    }
});

//edit / update an animal
router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const newData = req.body;

        const data = await editAnimal(id, newData); 
        res.status(200).json({ success: true, message: 'Animal updated successfully.', data: data });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to edit animal.', error: error.message });
    }
});



module.exports = router;