const express = require('express');
const controller = require('../controllers/recognition.controller');

const router = express.Router();

router.get('/get',controller.getRecognition);
router.post('/post',controller.postRecognition);

module.exports = router;
