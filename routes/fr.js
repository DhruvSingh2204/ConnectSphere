const express = require('express');
const router = express.Router();
const reqReaction = require('../controllers/reqReaction')

router.post('/load' , reqReaction.load)
router.post('/accept' , reqReaction.accept)
router.post('/decline' , reqReaction.decline)

module.exports = router;