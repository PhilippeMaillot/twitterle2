const db = require('../config/db');
const bcrypt = require('bcryptjs');
const postsModel = require('./postsModel');

class UsersModel {
    static findAll(callback) {
        db.query("SELECT * FROM users", callback);
    }

    static findOne(id, callback) {
        // Récupérer les informations de l'utilisateur
        const userQuery = "SELECT * FROM users WHERE id = ?";

        db.query(userQuery, [id], (error, results) => {
            if (error) return callback(error, null);
            if (results.length === 0) return callback(null, null);

            const user = results[0];

            // Récupérer les tweets de l'utilisateur
            const postsQuery = `
                SELECT posts.*, users.username, users.avatar, users.display_name
                FROM posts
                JOIN users ON posts.user_id = users.id
                WHERE posts.user_id = ?
                ORDER BY posts.created_at DESC
            `;

            db.query(postsQuery, [id], (error, posts) => {
                if (error) return callback(error, null);

                // Récupérer les tweets que l'utilisateur a likés
                const likedPostsQuery = `
                    SELECT posts.*, users.username, users.avatar, users.display_name
                    FROM likes
                    JOIN posts ON likes.post_id = posts.id
                    JOIN users ON posts.user_id = users.id
                    WHERE likes.user_id = ?
                    ORDER BY likes.created_at DESC
                `;

                db.query(likedPostsQuery, [id], (error, likedPosts) => {
                    if (error) return callback(error, null);

                    // Ajout des tweets et des likes au profil utilisateur
                    user.tweets = posts;
                    user.likedTweets = likedPosts;

                    callback(null, user);
                });
            });
        });
    }

    static create(data, callback) {
        const query = "INSERT INTO users SET ?";
        db.query(query, data, callback);
    }

    static update(id, data, callback) {
        if (!id || Object.keys(data).length === 0) {
            return callback(new Error("Données invalides"), null);
        }
    
        const query = "UPDATE users SET ? WHERE id = ?";
        db.query(query, [data, id], (error, results) => {
            if (error) {
                console.error("❌ Erreur SQL :", error);
                return callback(error, null);
            }
            console.log("✅ Mise à jour réussie :", results);
            callback(null, results);
        });
    }    

    static updateAvatar(id, avatar, callback) {
        const query = "UPDATE users SET avatar = ? WHERE id = ?";
    
        console.log("📌 SQL Query :", query, "avec valeurs :", avatar, id);
    
        db.query(query, [avatar, id], (error, results) => {
            if (error) {
                console.error("❌ Erreur SQL :", error);
                return callback(error, null);
            }
            console.log("✅ Avatar mis à jour en base !");
            callback(null, results);
        });
    }    

    static updateBanner(id, banner, callback) {
        const query = "UPDATE users SET banner = ? WHERE id = ?";
    
        console.log("📌 SQL Query :", query, "avec valeurs :", banner, id);
    
        db.query(query, [banner, id], (error, results) => {
            if (error) {
                console.error("❌ Erreur SQL :", error);
                return callback(error, null);
            }
            console.log("✅ bannière mis à jour en base !");
            callback(null, results);
        });
    }

    static delete(id, callback) {
        const query = "DELETE FROM users WHERE id = ?";
        db.query(query, [id], callback);
    }

    static findByEmail(email, callback) {
        db.query("SELECT * FROM users WHERE email = ?", [email], (error, results) => {
            if (error) return callback(error, null);
            callback(null, results.length > 0 ? results[0] : null);
        });
    }

    static registerUser(username, email, password, callback) {
        const displayName = `@${username.toLowerCase()}`;
        const hashedPassword = bcrypt.hashSync(password, 10);
        db.query(
            "INSERT INTO users (username, email, password, display_name) VALUES (?, ?, ?, ?)",
            [username, email, hashedPassword, displayName],
            callback
        );
    }
}

module.exports = UsersModel;
