const dynamiqueModel = require('../models/dynamiqueModel');

class DynamiqueController {
  static updateRecord = async (req, res) => {
    try {
      const { table, column, id, idValue, newValue } = req.body;
      const result = await dynamiqueModel.updateRecord(table, column, id, idValue, newValue);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Mise à jour réussie' });
      } else {
        res.status(404).json({ message: 'Enregistrement non trouvé' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };

  static insertRecord = async (req, res) => {
    try {
      const { table, columns, values } = req.body;
      const result = await dynamiqueModel.insertRecord(table, columns, values);
      res.status(200).json({ message: 'Insertion réussie', insertId: result.insertId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };

  static deleteRecord = async (req, res) => {
    try {
      const { table, id, idValue } = req.body;
      const result = await dynamiqueModel.deleteRecord(table, id, idValue);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Suppression réussie' });
      } else {
        res.status(404).json({ message: 'Enregistrement non trouvé' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  };
}

module.exports = DynamiqueController;
