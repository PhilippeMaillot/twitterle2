const express = require('express');
const router = express.Router();
const dynamiqueController = require('../controllers/dynamiqueController');

router.post('/insert', dynamiqueController.insertRecord);

router.post('/update', dynamiqueController.updateRecord);

router.post('/delete', dynamiqueController.deleteRecord);

module.exports = router;
