const express = require('express');
const router = express.Router();
const likePost = require('../controllers/like')

router.post('/likepost' , likePost.like)
router.post('/commentpost' , likePost.comment)
router.post('/loadlikes' , likePost.loadlikes)
router.post('/loadcomments' , likePost.loadcomments)
router.post('/checklike' , likePost.checklike)
router.post('/unlikePost' , likePost.unlike)
router.post('/showlikes' , likePost.showlikes)
router.post('/showcomments' , likePost.showcomments)

module.exports = router