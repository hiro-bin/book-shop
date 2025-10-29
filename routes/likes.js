const express = require('express');
const router = express.Router();
const {body, param, validationResult} = require('express-validator');
const {addLike, removeLike} = require('../controller/LikeController');
const {StatusCodes} = require('http-status-codes');

const {
    LIKED_BOOK_ID_VALIDATION,
} = require('../utils/validators');

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) return next();
    else return res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

router.post('/:id',
    [
        LIKED_BOOK_ID_VALIDATION,
        validate
    ],
    addLike);

router.delete('/:id',
    [
        LIKED_BOOK_ID_VALIDATION,
        validate
    ],
    removeLike);

module.exports = router;