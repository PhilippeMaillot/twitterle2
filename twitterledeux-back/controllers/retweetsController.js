
const retweetsModel = require('../models/retweetsModel');

class retweetsController {
    static async getAll(req, res) {
        try {
            retweetsModel.findAll((error, results) => {
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
            retweetsModel.findOne(id, (error, results) => {
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
            const data = req.body;
            retweetsModel.create(data, (error, results) => {
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
            retweetsModel.update(id, data, (error, results) => {
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
            retweetsModel.delete(id, (error, results) => {
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

module.exports = retweetsController;
