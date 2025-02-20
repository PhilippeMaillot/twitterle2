const path = require("path");

class UploadController {
    static uploadImage(req, res) {
        if (!req.file) {
            return null; // Aucun fichier envoyé
        }

        console.log("✅ Image uploadée:", req.file.filename);
        return req.file.filename; // Retourne juste le nom du fichier
    }
}

module.exports = UploadController;
