
const usersModel = require('../models/usersModel');

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
            const data = req.body;
            const { id } = req.params;
            usersModel.update(id, data, (error, results) => {
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
