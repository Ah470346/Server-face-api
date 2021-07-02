const express = require('express');
const controller = require('../controllers/authentication.controller');

const router = express.Router();

// router.get('/get',controller.getRecognition);
router.post('/post',controller.postAuth);

module.exports = router;
