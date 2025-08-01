const faqModel = require('../models/faqModel');  // Import the FAQ model

// GET: Fetch all FAQs
exports.getFaqs = async (req, res) => {
    try {
        const faqs = await faqModel.getAllFaqs();  // Use model to fetch FAQs
        res.status(200).json(faqs);  // Return FAQs as JSON
    } catch (err) {
        console.error('Error fetching FAQs:', err);
        res.status(500).json({ error: 'Failed to fetch FAQs' });
    }
};

// POST: Add a new FAQ
exports.addFaq = async (req, res) => {
    const { question, answer, category } = req.body;
    try {
        await faqModel.addFaq(question, answer, category);  // Use model to add FAQ
        res.status(201).json({ message: 'FAQ added successfully' }); // Success message
    } catch (err) {
        console.error('Error adding FAQ:', err);
        res.status(500).json({ error: 'Failed to add FAQ' });
    }
};

// PUT: Update an existing FAQ
exports.updateFaq = async (req, res) => {
    const faqId = req.params.id;
    const { question, answer, category } = req.body;
    try {
        await faqModel.updateFaq(faqId, question, answer, category);  // Use model to update FAQ
        res.status(200).json({ message: 'FAQ updated successfully' });
    } catch (err) {
        console.error('Error updating FAQ:', err);
        res.status(500).json({ error: 'Failed to update FAQ' });
    }
};

// DELETE: Delete an FAQ
exports.deleteFaq = async (req, res) => {
    const faqId = req.params.id;
    try {
        await faqModel.deleteFaq(faqId);  // Use model to delete FAQ
        res.status(200).json({ message: 'FAQ deleted successfully' });
    } catch (err) {
        console.error('Error deleting FAQ:', err);
        res.status(500).json({ error: 'Failed to delete FAQ' });
    }
};
