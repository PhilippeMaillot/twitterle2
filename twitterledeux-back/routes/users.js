
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.getAll);
router.get('/:id', usersController.getOne);
router.post('/', usersController.create);
router.put('/', usersController.update);
router.post('/changeAvatar', usersController.updateAvatar);
router.post('/changeBanner', usersController.updateBanner);
router.delete('/:id', usersController.delete);


module.exports = router;
