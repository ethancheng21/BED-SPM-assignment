const express = require("express");
const router = express.Router();
const controller = require("../controllers/medicationController");

router.post("/", controller.createMedication);
router.get("/user/:userId", controller.getMedicationsByUser);
router.delete("/:id", controller.deleteMedication);

module.exports = router;
