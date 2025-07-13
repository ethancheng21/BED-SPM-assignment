const express = require("express");
const router = express.Router();
const hobbyController = require("../controllers/hobbyController");

router.get("/", hobbyController.getAllHobbies);
router.get("/:id", hobbyController.getHobbyDetails);
router.post("/:id/join", hobbyController.joinHobby);
router.get("/user/:userId", hobbyController.getUserHobbies);

router.delete("/:id/leave", hobbyController.leaveHobby);

module.exports = router;
