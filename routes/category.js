const express = require('express');
const dotenv = require('dotenv').config();
const router = express.Router();
const {
    allCategory
} = require('../controller/CategoryController');

router.use(express.json());

router.get('/', allCategory);

module.exports = router;