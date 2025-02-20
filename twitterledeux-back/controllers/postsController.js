const postsModel = require("../models/postsModel");
const upload = require("../middleware/upload");
const UploadController = require("../controllers/uploadController");
const AuthController = require("../controllers/authController");

class postsController {
    static async getAll(req, res) {
        try {
            postsModel.findAll((error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Une erreur est survenue." });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: "Une erreur est survenue." });
        }
    }

    static async getOne(req, res) {
        try {
            const { id } = req.params;
            postsModel.findOne(id, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Une erreur est survenue." });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: "Une erreur est survenue." });
        }
    }

    static create(req, res) {
        upload.single("image")(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur lors de l'upload de l'image." });
            }

            if (!req.body.content) {
                return res.status(400).json({ error: "Le contenu du tweet est obligatoire." });
            }

            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: "Utilisateur non authentifié." });
            }

            const imageFilename = req.file ? req.file.filename : null;

            const newPost = {
                user_id: userId,
                content: req.body.content,
                image: imageFilename,
                created_at: new Date()
            };

            postsModel.create(newPost, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Erreur lors de l'ajout du post." });
                }
                res.status(201).json({ id: results.insertId, ...newPost });
            });
        });
    }

    static async update(req, res) {
        try {
            const data = req.body;
            const { id } = req.params;
            postsModel.update(id, data, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Une erreur est survenue." });
                }
                res.status(200).json({ id, ...data });
            });
        } catch (error) {
            res.status(500).json({ error: "Une erreur est survenue." });
        }
    }

    //findUserLikedPosts
    static async findUserLikedPosts(req, res) {
        try {
            const userId = AuthController.decodeToken(req);
            postsModel.findUserLikedPosts(userId, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Une erreur est survenue." });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: "Une erreur est survenue." });
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params;
            postsModel.delete(id, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: "Une erreur est survenue." });
                }
                res.status(200).json({ message: "Post supprimé." });
            });
        } catch (error) {
            res.status(500).json({ error: "Une erreur est survenue." });
        }
    }
}

module.exports = postsController;
