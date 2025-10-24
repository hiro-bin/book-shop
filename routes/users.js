const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const jwt = require('jsonwebtoken');

const {body, param, validationResult} = require('express-validator');
const {StatusCodes} = require('http-status-codes');
const {
    join,
    login, 
    passwordResetRequest,
    passwordReset
} = require('../controller/UserController');

const {
    EMAIL_VALIDATION,
    PASSWORD_VALIDATION,
} = require('../utils/validators');

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) return next();
    else return res.status(400).json(err.array());
}

router.post('/join',
    [
        EMAIL_VALIDATION,
        PASSWORD_VALIDATION,
        validate
    ],
    join);

router.post('/login',
    [
        EMAIL_VALIDATION,
        PASSWORD_VALIDATION,
        validate
    ],
    login);

router.post('/reset',
    [
        EMAIL_VALIDATION,
        validate
    ],
    passwordResetRequest);

router.put('/reset',
    [
        EMAIL_VALIDATION,
        PASSWORD_VALIDATION,
        validate
    ],
    passwordReset);

module.exports = router;