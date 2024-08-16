const express = require('express');
const multer = require('multer');

const authController = require('./../controllers/authController');
const uploadController = require("./../controllers/uploadController");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");

const router = express.Router();

router
    .route('/upload')
    .post(authController.protect, upload, uploadController.uploadFile)

router
    .route('/delete')
    .delete(authController.protect, uploadController.deleteFile)

module.exports = router;
