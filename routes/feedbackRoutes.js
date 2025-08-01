// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// POST /api/feedback
router.post('/', feedbackController.submitFeedback);

module.exports = router;
