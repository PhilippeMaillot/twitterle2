
const db = require('../config/db');

class likesModel {

    static findAll(callback) {
        return db.query("SELECT * FROM likes", [], callback);
    }

    static findOne(id, callback) {
        return db.query("SELECT * FROM likes WHERE id = ?", [id], callback);
    }

    static create(data, callback) {
        const query = "INSERT INTO likes (user_id, post_id, created_at) VALUES (?, ?, NOW())";
        return db.query(query, [data.user_id, data.post_id], callback);
    }

    static update(id, data, callback) {
        const query = "UPDATE likes SET ? WHERE id = ?";
        return db.query(query, [data, id], callback);
    }

    static delete(data, callback) {
        console.log("on a id : ", data.post_id);
        console.log("on a user_id : ", data.user_id);
        const query = "DELETE FROM likes WHERE post_id = ? AND user_id = ?";
        return db.query(query, [data.post_id, data.user_id], callback);
    }

}

module.exports = likesModel;
