const express = require('express');
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const {body, param, validationResult} = require('express-validator');
const {
    allBooks,
    bookDetail,
    booksByCategory
} = require('../controller/BookController');

const {
    CATEGORY_ID_VALIDATION,
    NEWS_VALIDATION,
    LIMIT_VALIDATION,
    CURRENTPAGE_VALIDATION,
    BOOK_ID_IN_PARAM_VALIDATION,
} = require('../utils/validators');

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) return next();
    else return res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

//router.get('/', booksByCategory);
router.get('/',
    [
        CATEGORY_ID_VALIDATION,
        NEWS_VALIDATION,
        LIMIT_VALIDATION,
        CURRENTPAGE_VALIDATION,
        validate,
    ],
    allBooks);
router.get('/:id',
    [
        BOOK_ID_IN_PARAM_VALIDATION,
        validate,
    ],
    bookDetail);

module.exports = router;