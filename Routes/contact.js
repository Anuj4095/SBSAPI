const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const contactController = require('../controllers/contactController');

// Add new contact
router.post('/addcontact', checkAuth, contactController.addContact);

// Get all contacts (supports ?page=1&limit=10)
router.get('/allcontact', checkAuth, contactController.getAllContacts);

// Get total contacts count
router.get('/count', checkAuth, contactController.getContactCount);

// Get single contact by ID
router.get('/contactbyid/:id', checkAuth, contactController.getContactById);

// Get contacts filtered by gender
router.get('/contactbygender/:gender', checkAuth, contactController.getContactByGender);

// Update contact by ID
router.put('/:id', checkAuth, contactController.updateContact);

// Delete contact by ID
router.delete('/:id', checkAuth, contactController.deleteContact);

// Delete contacts by gender
router.delete('/deletebygender/:gender', checkAuth, contactController.deleteByGender);

module.exports = router;
