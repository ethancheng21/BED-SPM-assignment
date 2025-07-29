const express = require("express");
const router = express.Router();
const transportController = require("../controllers/transportController");

router.get("/route", transportController.getPublicTransportRoute);

module.exports = router;
