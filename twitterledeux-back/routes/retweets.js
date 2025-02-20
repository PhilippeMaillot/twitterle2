
const express = require('express');
const router = express.Router();
const retweetsController = require('../controllers/retweetsController');

router.get('/', retweetsController.getAll);
router.get('/:id', retweetsController.getOne);
router.post('/', retweetsController.create);
router.put('/:id', retweetsController.update);
router.delete('/:id', retweetsController.delete);


module.exports = router;
