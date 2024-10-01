const express = require('express')
const router = express.Router();
const personController = require('../controllers/person')

router.post('/persons' , personController.persons)
router.post('/person' , personController.person)

module.exports = router