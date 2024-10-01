const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat');

router.post('/loadProfiles' , chatController.loadProfiles);
router.post('/loadChat' , chatController.loadChat);
router.post('/sendmsg' , chatController.sendmsg);

module.exports = router;