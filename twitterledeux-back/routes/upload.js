const express = require("express");
const upload = require("../middleware/upload");
const UploadController = require("../controllers/uploadController");

const router = express.Router();

// Route pour uploader une image
router.post("/", upload.single("image"), UploadController.uploadImage);

module.exports = router;
