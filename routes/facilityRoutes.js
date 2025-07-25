const express = require("express");
const router = express.Router();
const { getNearbyFacilities, createFacility, updateFacility, deleteFacility } = require("../controllers/facilityController");

// GET - Fetch all nearby facilities based on lat, lng, and max distance
router.get("/nearby", getNearbyFacilities);

// POST - Create a new facility
router.post("/", createFacility);

// PUT - Update an existing facility by ID
router.put("/:id", updateFacility);

// DELETE - Delete a facility by ID
router.delete("/:id", deleteFacility);

module.exports = router;
