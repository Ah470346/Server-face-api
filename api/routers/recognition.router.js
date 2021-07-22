const express = require('express');
const multer = require("multer");
const controller = require('../controllers/recognition.controller');

const upload = multer({dest:"./public/uploads/"});

const router = express.Router();

router.get('/get',controller.getRecognition);
router.post('/post',controller.postRecognition);
router.post('/editActive',controller.editActiveRecognition);
router.post('/delete',controller.deleteRecognition);
router.post('/clone',controller.cloneRecognition);
router.post('/move',controller.moveRecognition);
router.post('/upload', upload.single("file"),controller.uploadRecognition);

module.exports = router;
