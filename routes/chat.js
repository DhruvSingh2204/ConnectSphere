const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');
const verifyjwt = require('../middleware/verifyJWT')

router.post('/loadProfiles', verifyjwt.verifyToken, chatController.loadProfiles);
router.post('/loadChat', verifyjwt.verifyToken, chatController.loadChat);
router.post('/sendmsg', chatController.sendmsg);

module.exports = router;