const express = require('express');
const controller = require('../controllers/recognition.controller');

const router = express.Router();

router.get('/get',controller.getRecognition);
router.post('/post',controller.postRecognition);
router.post('/editActive',controller.editActiveRecognition);
router.post('/delete',controller.deleteRecognition);
router.post('/clone',controller.cloneRecognition);
router.post('/move',controller.moveRecognition);

module.exports = router;
