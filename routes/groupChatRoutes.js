const express = require("express");
const router = express.Router();
const groupchatController = require("../controllers/groupChatController");
const { checkUserLoggedIn } = require("../middlewares/authMiddleware");

router.get("/:hobbyId", groupchatController.getMessages);
router.post("/:hobbyId", checkUserLoggedIn, groupchatController.postMessage);

module.exports = router;
