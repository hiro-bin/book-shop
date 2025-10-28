const express = require('express');
const router = express.Router();

const {body, param, validationResult} = require('express-validator');
const {StatusCodes} = require('http-status-codes');
const {order, getOrders, getOrderDetail} = require('../controller/OrderController');

const {
    ITEMS_VALIDATION,
    DELIVERY_VALIDATION,
    TOTALQUANTITY_VALIDATION,
    TOTALPRICE_VALIDATION,
    USER_ID_VALIDATION,
    FIRSTBOOKTITLE_VALIDATION,
    ORDER_ID_IN_PARAM_VALIDATION
} = require('../utils/validators');

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) return next();
    else return res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

router.post('/',
    [
        ITEMS_VALIDATION,
        DELIVERY_VALIDATION,
        TOTALQUANTITY_VALIDATION,
        TOTALPRICE_VALIDATION,
        USER_ID_VALIDATION,
        FIRSTBOOKTITLE_VALIDATION,
        validate
    ],
    order);

router.get('/', getOrders);

router.get('/:id',
    [
        ORDER_ID_IN_PARAM_VALIDATION,
        validate
    ],
    getOrderDetail);

module.exports = router;