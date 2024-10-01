const express = require('express');
const router = express.Router();
const Post = require('../controllers/post');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadsDir = path.join(__dirname, '../uploads/');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploads);
}

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/article', upload.fields([
    { name: 'shareImage', maxCount: 1 },
    { name: 'shareVideo', maxCount: 1 }
]), Post.postArticle);

module.exports = router;