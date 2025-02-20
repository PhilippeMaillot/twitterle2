
const express = require('express');
const router = express.Router();
const likesController = require('../controllers/likesController');

router.get('/', likesController.getAll);
router.get('/:id', likesController.getOne);
router.post('/', likesController.create);
router.put('/:id', likesController.update);
router.delete('/:id', likesController.delete);


module.exports = router;
