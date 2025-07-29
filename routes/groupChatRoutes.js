const express = require("express");
const router = express.Router();
const groupchatController = require("../controllers/groupChatController");


router.get("/:hobbyId", groupchatController.getMessages);
router.post("/:hobbyId", groupchatController.postMessage);

module.exports = router;

