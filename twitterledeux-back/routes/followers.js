
const express = require('express');
const router = express.Router();
const followersController = require('../controllers/followersController');

router.get('/', followersController.getAll);
router.get('/:id', followersController.getOne);
router.post('/', followersController.create);
router.put('/:id', followersController.update);
router.delete('/:id', followersController.delete);


module.exports = router;
