const express = require('express');
const router = express.Router();
const reqController = require('../controllers/req')

router.post('/get' , reqController.req)
router.post('/check' , reqController.checkFriends)
router.post('/findno' , reqController.noOfFriends)
router.post('/findFollowing' , reqController.findFollowing)
router.post('/posts' , reqController.posts)

module.exports = router;