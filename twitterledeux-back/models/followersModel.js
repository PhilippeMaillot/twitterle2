
const db = require('../config/db');

class followersModel {

    static findAll(callback) {
        return db.query("SELECT * FROM followers", [], callback);
    }

    static findOne(id, callback) {
        return db.query("SELECT * FROM followers WHERE id = ?", [id], callback);
    }

    static create(data, callback) {
        const query = "INSERT INTO followers SET ?";
        return db.query(query, data, callback);
    }

    static update(id, data, callback) {
        const query = "UPDATE followers SET ? WHERE id = ?";
        return db.query(query, [data, id], callback);
    }

    static delete(id, callback) {
        const query = "DELETE FROM followers WHERE id = ?";
        return db.query(query, [id], callback);
    }

}

module.exports = followersModel;
