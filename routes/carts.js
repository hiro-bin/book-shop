const express = require('express');
const router = express.Router();
const {addToCart, getCartItems, removeCartItem} = require('../controller/CartController');
const {StatusCodes} = require('http-status-codes');

const {
    BOOK_ID_IN_BODY_VALIDATION,
    QUANTITY_VALIDATION,
    USER_ID_VALIDATION,
    CARTITEMS_ID_VALIDATION,
    SELECTED_VALIDATION,
} = require('../utils/validators');

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) return next();
    else return res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

router.post('/',
    [
        BOOK_ID_IN_BODY_VALIDATION,
        QUANTITY_VALIDATION,
        USER_ID_VALIDATION,
        validate
    ],
    addToCart);

router.get('/',
    [
        USER_ID_VALIDATION,
        SELECTED_VALIDATION,
        validate
    ],
    getCartItems);

router.delete('/:id',
    [
        CARTITEMS_ID_VALIDATION,
        validate
    ],
    removeCartItem);


module.exports = router;