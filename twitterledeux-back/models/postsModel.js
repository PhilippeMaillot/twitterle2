const db = require('../config/db');

class postsModel {

    static findAll(callback) {
        const query = `
            SELECT 
                posts.*, 
                users.username, 
                users.avatar,
                users.display_name,
                COUNT(likes.id) AS likes  -- Compte les likes pour chaque post
            FROM posts
            JOIN users ON posts.user_id = users.id
            LEFT JOIN likes ON posts.id = likes.post_id -- LEFT JOIN pour inclure les posts sans like
            GROUP BY posts.id, users.username, users.avatar, users.display_name
            ORDER BY posts.created_at DESC
        `;
    
        return db.query(query, [], callback);
    }    

    static findOne(id, callback) {
        const query = `
            SELECT 
                posts.*, 
                users.username, 
                users.avatar,
                users.display_name,
                COUNT(likes.id) AS likes -- Compte les likes pour CE post
            FROM posts
            JOIN users ON posts.user_id = users.id
            LEFT JOIN likes ON posts.id = likes.post_id
            WHERE posts.id = ?
            GROUP BY posts.id, users.username, users.avatar, users.display_name
        `;
    
        return db.query(query, [id], callback);
    }
    
    //recuperer les postes liké par le user et return les id des postes likés
    static findUserLikedPosts(user_id, callback) {
        const query = "SELECT post_id FROM likes WHERE user_id = ?";
        return db.query(query, [user_id], callback);
    }
    
    static create(data, callback) {
        const query = "INSERT INTO posts SET ?";
        return db.query(query, data, callback);
    }

    static update(id, data, callback) {
        const query = "UPDATE posts SET ? WHERE id = ?";
        return db.query(query, [data, id], callback);
    }

    static delete(id, callback) {
        const query = "DELETE FROM posts WHERE id = ?";
        return db.query(query, [id], callback);
    }
}

module.exports = postsModel;
