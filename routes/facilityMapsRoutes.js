const express = require("express");
const router = express.Router();
const facilityMapsController = require("../controllers/facilityMapsController");

// Get all OneMap facilities (whole SG)
router.get("/all", facilityMapsController.getFacilitiesFromOneMap);

// Get public transport route
router.get("/transport/route", facilityMapsController.getPublicTransportRoute);

module.exports = router;
