const db = require('../config/db');

class messagesModel {
    static findAll(callback) {
        return db.query("SELECT * FROM messages", [], callback);
    }

    static findOne(id, callback) {
        return db.query("SELECT * FROM messages WHERE id = ?", [id], callback);
    }

    static findByUsers(userId1, userId2, callback) {
        const query = `
            SELECT * FROM messages
            WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
        `;
        return db.query(query, [userId1, userId2, userId2, userId1], callback);
    }

    static findUserConversations(userId, callback) {
        const query = `
            SELECT 
                u.id AS user_id, 
                u.username, 
                m.content AS last_message,
                m.created_at
            FROM messages m
            JOIN users u ON 
                (u.id = m.sender_id AND m.receiver_id = ?) 
                OR (u.id = m.receiver_id AND m.sender_id = ?)
            WHERE m.id = (
                SELECT id FROM messages 
                WHERE (sender_id = u.id AND receiver_id = ?) 
                   OR (receiver_id = u.id AND sender_id = ?)
                ORDER BY created_at DESC 
                LIMIT 1
            )
            ORDER BY m.created_at DESC;
        `;
        return db.query(query, [userId, userId, userId, userId], callback);
    }

    static create(data, callback) {
        const { senderId, receiverId, content } = data;
        const query = "INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES (?, ?, ?, NOW())";
        return db.query(query, [senderId, receiverId, content], callback);
    }

    static update(id, data, callback) {
        const query = "UPDATE messages SET ? WHERE id = ?";
        return db.query(query, [data, id], callback);
    }

    static delete(id, callback) {
        const query = "DELETE FROM messages WHERE id = ?";
        return db.query(query, [id], callback);
    }
}

module.exports = messagesModel;
