<<<<<<< HEAD
const express = require("express");
const router = express.Router();
const groupchatController = require("../controllers/groupChatController");


router.get("/:hobbyId", groupchatController.getMessages);
router.post("/:hobbyId", groupchatController.postMessage);

module.exports = router;
=======
g
>>>>>>> 198432a1a35a55bbb72b7e2e186ac9f739032b47
