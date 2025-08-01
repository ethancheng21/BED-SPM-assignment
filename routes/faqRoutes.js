const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// GET: Fetch all FAQs
router.get('/', faqController.getFaqs);

// POST: Add a new FAQ
router.post('/', faqController.addFaq);

// PUT: Update an existing FAQ
router.put('/:id', faqController.updateFaq);

// DELETE: Delete an FAQ
router.delete('/:id', faqController.deleteFaq);

module.exports = router;
