const express = require('express');
const router = express.Router();

const { downloadVideo } = require('../Controllers/Download.js');



router.get('/download', downloadVideo);

module.exports = router;
