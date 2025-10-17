const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const {
        join,
        login, 
        passwordResetRequest,
        passwordReset
    } = require('../controller/UserController');
const jwt = require('jsonwebtoken');
const {body, param, validationResult} = require('express-validator');

dotenv.config();

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);

    if(err.isEmpty()) return next();
    else return res.status(400).json(err.array());
}

router.post('/join',
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().withMessage('비밀번호 확인 필요'),
        validate
    ],
    join);

router.post('/login', login);

router.post('/reset', passwordResetRequest);

router.put('/reset', passwordReset);

module.exports = router;