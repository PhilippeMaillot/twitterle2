
const usersModel = require('../models/usersModel');
const authController = require('./authController');
const bcrypt = require("bcryptjs");

class usersController {
    static async getAll(req, res) {
        try {
            usersModel.findAll((error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'Une erreur est survenue.' });
                }
                res.status(200).json(results);
            });
        } catch (error) {
            res.status(500).json({ error: 'Une erreur est survenue.' });
        }
    }

    static async getOne(req, res) {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                return res.status(401).json({ error: 'Utilisateur non authentifié.' });
            }

            usersModel.findOne(userId, (error, user) => {
                if (error) {
                    return res.status(500).json({ error: 'Une erreur est survenue.' });
                }
                if (!user) {
                    return res.status(404).json({ error: "Utilisateur introuvable." });
                }
                res.status(200).json(user);
            });
        } catch (error) {
            res.status(500).json({ error: 'Une erreur est survenue.' });
        }
    }

    static async create(req, res) {
        try {
            const data = req.body;
            usersModel.create(data, (error, results) => {
                if (error) {
                    return res.status(500).json({ error: 'An error occurred' });
                }
                res.status(201).json({ id: results.insertId, ...data });
            });
        } catch (error) {
            res.status(500).json({ error: 'An error occurred' });
        }
    }

    static async update(req, res) {
        try {
            const id = authController.decodeToken(req);
            let data = req.body;
    
            if (!id) {
                return res.status(400).json({ error: "ID utilisateur manquant." });
            }
    
            // Vérifie si l'utilisateur change son mot de passe
            if (data.password) {
                const salt = await bcrypt.genSalt(10); // Génère un salt pour renforcer le hash
                data.password = await bcrypt.hash(data.password, salt); // Hash le mot de passe
            }
    
            usersModel.update(id, data, (error, results) => {
                if (error) {
                    console.error("❌ Erreur SQL :", error);
                    return res.status(500).json({ error: "Une erreur est survenue." });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ error: "Utilisateur non trouvé." });
                }
                res.status(200).json({ message: "Mise à jour réussie", id, ...data });
            });
        } catch (error) {
            console.error("❌ Erreur serveur :", error);
            res.status(500).json({ error: "Une erreur est survenue." });
        }
    }  

    static async updateAvatar(req, res) {
        try {
            console.log("📥 Requête reçue pour changer d'avatar :", req.body);
    
            const { avatar } = req.body;
            if (!avatar) {
                console.error("❌ Erreur : Aucun avatar fourni !");
                return res.status(400).json({ error: "Aucun avatar fourni." });
            }
    
            const id = authController.decodeToken(req);
            if (!id) {
                console.error("❌ Erreur : Utilisateur non authentifié !");
                return res.status(401).json({ error: "Utilisateur non authentifié." });
            }
    
            console.log("🔄 Mise à jour de l'avatar pour l'utilisateur :", id);
    
            usersModel.updateAvatar(id, avatar, (error, results) => {
                if (error) {
                    console.error("❌ Erreur SQL :", error);
                    return res.status(500).json({ error: "Erreur lors de la mise à jour de l'avatar." });
                }
    
                console.log("✅ Avatar mis à jour avec succès !");
                res.status(200).json({ id, avatar });
            });
        } catch (error) {
            console.error("❌ Erreur serveur :", error);
            res.status(500).json({ error: "Une erreur est survenue." });
        }
    }    

    static async updateBanner(req, res) {
        try {
            console.log("📥 Requête reçue pour changer la bannière :", req.body);
    
            const { banner } = req.body;
            if (!banner) {
                console.error("❌ Erreur : Aucune bannière fournie !");
                return res.status(400).json({ error: "Aucune bannière fournie." });
            }
    
            const id = authController.decodeToken(req);
            if (!id) {
                console.error("❌ Erreur : Utilisateur non authentifié !");
                return res.status(401).json({ error: "Utilisateur non authentifié." });
            }
    
            console.log("🔄 Mise à jour de la bannière pour l'utilisateur :", id);
    
            usersModel.updateBanner(id, banner, (error, results) => {
                if (error) {
                    console.error("❌ Erreur SQL :", error);
                    return res.status(500).json({ error: "Erreur lors de la mise à jour de la bannière." });
                }
    
                console.log("✅ Bannière mise à jour avec succès !");
                res.status(200).json({ id, banner });
            });
        } catch (error) {
            console.error("❌ Erreur serveur :", error);
            res.status(500).json({ error: "Une erreur est survenue." });
        }
    }    

    static async delete(req, res) {
        try {
            const { id } = req.params;
            usersModel.delete(id, (error, results) => {
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

module.exports = usersController;
