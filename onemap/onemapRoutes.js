const express = require('express');
const router = express.Router();
const { getOneMapToken } = require('./onemapController');

// Now visiting this URL will trigger the fetch
router.get('/token', getOneMapToken);

module.exports = router;
