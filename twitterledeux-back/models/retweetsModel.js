
const db = require('../config/db');

class retweetsModel {

    static findAll(callback) {
        return db.query("SELECT * FROM retweets", [], callback);
    }

    static findOne(id, callback) {
        return db.query("SELECT * FROM retweets WHERE id = ?", [id], callback);
    }

    static create(data, callback) {
        const query = "INSERT INTO retweets SET ?";
        return db.query(query, data, callback);
    }

    static update(id, data, callback) {
        const query = "UPDATE retweets SET ? WHERE id = ?";
        return db.query(query, [data, id], callback);
    }

    static delete(id, callback) {
        const query = "DELETE FROM retweets WHERE id = ?";
        return db.query(query, [id], callback);
    }

}

module.exports = retweetsModel;
