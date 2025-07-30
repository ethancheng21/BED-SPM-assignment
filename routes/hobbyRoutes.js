const express = require("express");
const router = express.Router();
const hobbyController = require("../controllers/hobbyController");
const { checkUserLoggedIn } = require("../middlewares/authMiddleware");

router.get("/", hobbyController.getAllHobbies);
router.get("/:id", hobbyController.getHobbyDetails);
router.post("/:id/join", checkUserLoggedIn, hobbyController.joinHobby);
router.delete("/:id/leave", checkUserLoggedIn, hobbyController.leaveHobby);
router.get("/user/:userId", hobbyController.getUserHobbies);

module.exports = router;
