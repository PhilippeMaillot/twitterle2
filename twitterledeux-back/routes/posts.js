
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', postsController.getAll);
router.get('/:id', postsController.getOne);
router.post('/byUser', postsController.findUserLikedPosts)
router.post('/', authMiddleware, postsController.create);
router.put('/:id', postsController.update);
router.delete('/:id', postsController.delete);


module.exports = router;
