const messagesModel = require('../models/messagesModel');
const authController = require('./authController');

class messagesController {
    static async getAll(req, res) {
        try {
            messagesModel.findAll((error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static async getMessagesBetweenUsers(req, res) {
        try {
            const userId = authController.decodeToken(req);
            const { receiverId } = req.params; 

            messagesModel.findByUsers(userId, receiverId, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static async getUserConversations(req, res) {
        try {
            const userId = authController.decodeToken(req);
            messagesModel.findUserConversations(userId, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Une erreur est survenue." });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: "Une erreur est survenue." });
        }
    }
    

    static async create(req, res) {
        try {
            const senderId = authController.decodeToken(req);
            const { receiverId, content } = req.body;

            if (!receiverId || !content) {
                return res.status(400).json({ error: "Receiver ID and content are required." });
            }

            messagesModel.create({ senderId, receiverId, content }, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(201).json({ id: results.insertId, senderId, receiverId, content });
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }
}

module.exports = messagesController;
