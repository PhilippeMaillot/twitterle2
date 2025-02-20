const path = require("path");

class UploadController {
    static uploadImage(req, res) {
        if (!req.file) {
            return res.status(400).json({ error: "Aucun fichier envoyé" }); // ✅ Envoie une réponse HTTP correcte
        }

        console.log("✅ Image uploadée:", req.file.filename);

        // 🔥 Construction de l'URL d'accès à l'image
        const imageUrl = req.file.filename;

        return res.status(200).json({ imageUrl }); // ✅ Réponse avec l'URL de l'image
    }
}

module.exports = UploadController;
