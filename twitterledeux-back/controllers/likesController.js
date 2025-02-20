
const likesModel = require('../models/likesModel');
const AuthController = require('./authController');

class likesController {
    static async getAll(req, res) {
        try {
            likesModel.findAll((error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static async getOne(req, res) {
        try {
            const { id } = req.params;
            likesModel.findOne(id, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static async create(req, res) {
        try {
            const userId = AuthController.decodeToken(req); // ✅ Récupère `user_id`
            const { post_id } = req.body;
            console.log(post_id);
            console.log(userId);

            if (!post_id) {
                return res.status(400).json({ error: "L'ID du post est obligatoire." });
            }

            const likeData = {
                user_id: userId,
                post_id: post_id,
            };

            likesModel.create(likeData, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Une erreur est survenue lors de l'ajout du like." });
                }
                res.status(201).json({ id: results.insertId, ...likeData });
            });

        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    static async update(req, res) {
        try {
            const data = req.body;
            const { id } = req.params;
            likesModel.update(id, data, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json({ id, ...data });
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = AuthController.decodeToken(req);

            const likeData = {
                user_id: userId,
                post_id: id,
            };
            console.log("on a id : ", id);
            likesModel.delete(likeData, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(200).json({ message: 'Record deleted' });
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

}

module.exports = likesController;
