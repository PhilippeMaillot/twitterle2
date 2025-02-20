const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/', messagesController.getAll);
router.get('/conversation/:receiverId', messagesController.getMessagesBetweenUsers);
router.post('/', messagesController.create);
router.get('/conversations', messagesController.getUserConversations);

module.exports = router;
