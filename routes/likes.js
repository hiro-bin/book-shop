const express = require('express');
const router = express.Router();
const {addLike, removeLike} = require('../controller/LikeController');
const {StatusCodes} = require('http-status-codes');

const {
    USER_ID_VALIDATION,
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
        USER_ID_VALIDATION,
        LIKED_BOOK_ID_VALIDATION,
        validate
    ],
    addLike);

router.delete('/:id',
    [
        USER_ID_VALIDATION,
        LIKED_BOOK_ID_VALIDATION,
        validate
    ],
    removeLike);

module.exports = router;