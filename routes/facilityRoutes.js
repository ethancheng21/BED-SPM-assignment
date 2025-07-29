const express = require("express");
const router = express.Router();

const {
  getNearbyFacilities,
  getCombinedFacilities,
  createFacility,
  updateFacility,
  deleteFacility
} = require("../controllers/facilityController");

// ✅ Debug logs (optional)
console.log("🔍 getNearbyFacilities:", typeof getNearbyFacilities);
console.log("🔍 getCombinedFacilities:", typeof getCombinedFacilities);
console.log("🔍 createFacility:", typeof createFacility);
console.log("🔍 updateFacility:", typeof updateFacility);
console.log("🔍 deleteFacility:", typeof deleteFacility);

// ✅ Routes
router.get("/nearby", getCombinedFacilities);
router.post("/", createFacility);
router.put("/:id", updateFacility);
router.delete("/:id", deleteFacility);

module.exports = router;
