const db = require('../config/db');

class DynamiqueModel {
  static updateRecord = (table, column, id, idValue, newValue) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
      db.query(query, [table, column, newValue, id, idValue], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };

  static insertRecord = (table, columns, values) => {
    return new Promise((resolve, reject) => {
      const placeholders = columns.map(() => '?').join(', ');
      const query = `INSERT INTO ?? (??) VALUES (${placeholders})`;
      db.query(query, [table, columns, ...values], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };

  static deleteRecord = (table, id, idValue) => {
    return new Promise((resolve, reject) => {
      const query = 'DELETE FROM ?? WHERE ?? = ?';
      db.query(query, [table, id, idValue], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });
  };
}

module.exports = DynamiqueModel;
