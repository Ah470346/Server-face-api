const express = require('express');
const controller = require('../controllers/channel.controller');

const router = express.Router();

router.get('/get',controller.getChannel);
router.post('/post',controller.postChannel);
router.post('/edit',controller.editChannel);
router.post('/delete',controller.deleteChannel);

module.exports = router;