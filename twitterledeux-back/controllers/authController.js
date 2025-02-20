const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const UsersModel = require("../models/usersModel");

dotenv.config();

class AuthController {
    // Inscription
    static register(req, res) {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        // Vérifier si l'utilisateur existe déjà
        UsersModel.findByEmail(email, (err, existingUser) => {
            if (err) return res.status(500).json({ error: "Erreur serveur." });
            if (existingUser) {
                return res.status(400).json({ error: "Cet email est déjà utilisé." });
            }

            // Créer l'utilisateur
            UsersModel.registerUser(username, email, password, (err, result) => {
                if (err) return res.status(500).json({ error: "Erreur serveur." });

                res.status(201).json({
                    message: "Utilisateur créé avec succès !",
                    user: { id: result.insertId, username, email }
                });
            });
        });
    }

    // Connexion
    static login(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email et mot de passe requis." });
        }

        UsersModel.findByEmail(email, (err, user) => {
            if (err) return res.status(500).json({ error: "Erreur serveur." });
            if (!user) {
                return res.status(401).json({ error: "Email ou mot de passe incorrect." });
            }

            // Vérification du mot de passe
            const isMatch = bcrypt.compareSync(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Email ou mot de passe incorrect." });
            }

            // Génération du token JWT
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "24h" });

            res.json({ token, userId: user.id, username: user.username });
        });
    }

    // Récupérer l'utilisateur connecté
    static me(req, res) {
        const authHeader = req.header("Authorization");

        if (!authHeader) {
            return res.status(401).json({ error: "Accès non autorisé, token manquant" });
        }

        const tokenParts = authHeader.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({ error: "Format du token invalide" });
        }

        const token = tokenParts[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const userId = decoded.userId;

            // 🔥 Au lieu de renvoyer juste l'utilisateur, on récupère toutes ses infos
            UsersModel.findOne(userId, (err, user) => {
                if (err) return res.status(500).json({ error: "Erreur serveur." });
                if (!user) return res.status(404).json({ error: "Utilisateur introuvable" });

                res.json(user); // ✅ Renvoie toutes les données utilisateur, tweets et likes inclus
            });

        } catch (error) {
            return res.status(401).json({ error: "Token invalide" });
        }
    }

    static decodeToken(req) {
        const authHeader = req.header("Authorization");
    
        if (!authHeader) {
            throw new Error("Token manquant");
        }
    
        const tokenParts = authHeader.split(" ");
        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            throw new Error("Format du token invalide");
        }
    
        const token = tokenParts[1];
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded.userId; // ✅ Retourne uniquement `userId`
        } catch (error) {
            throw new Error("Token invalide");
        }
    }
    
}

module.exports = AuthController;
