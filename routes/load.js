const express = require('express');
const router = express.Router();
const loadController = require('../controllers/loadMain')

router.post('/main' , loadController.loadmain)

module.exports = router