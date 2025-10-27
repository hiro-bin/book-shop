const express = require('express');
const router = express.Router();

const {body, param, validationResult} = require('express-validator');
const {StatusCodes} = require('http-status-codes');
const {order, getOrders, getOrderDetail} = require('../controller/OrderController');

const {
    BOOK_ID_VALIDATION,
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

router.post('/', order);

router.get('/',
    [
        USER_ID_VALIDATION,
        SELECTED_VALIDATION,
        validate
    ],
    getOrders);

router.get('/:id', getOrderDetail);

module.exports = router;