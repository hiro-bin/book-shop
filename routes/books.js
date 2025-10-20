const express = require('express');
const dotenv = require('dotenv').config();
const router = express.Router();
const {
    allBooks,
    bookDetail,
    booksByCategory
} = require('../controller/BookController');

router.use(express.json());

//router.get('/', booksByCategory);
router.get('/', allBooks);
router.get('/:id', bookDetail);

module.exports = router;