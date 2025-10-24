const { body } = require('express-validator');

const EMAIL_VALIDATION = body('email').notEmpty().isEmail().withMessage('이메일 확인 필요');

const PASSWORD_VALIDATION = body('password').notEmpty().withMessage('비밀번호 확인 필요');

const BOOK_ID_VALIDATION = body('book_id').notEmpty().isInt().withMessage('book_id 확인 필요');

const QUANTITY_VALIDATION = body('quantity').notEmpty().isInt().withMessage('quantity 확인 필요');

const USER_ID_VALIDATION = body('user_id').notEmpty().isInt().withMessage('user_id 확인 필요');

const CARTITEMS_ID_VALIDATION = param('id').notEmpty().isInt().withMessage('cartItems.id 확인 필요');

const SELECTED_VALIDATION = [
    body('selected').notEmpty().isArray().withMessage('selected가 배열인지 확인 필요'),
    body('selected.*').isInt().withMessage('selected 확인 필요')
];

const LIKED_BOOK_ID_VALIDATION = param('id').notEmpty().isInt().withMessage('liked_book_id 확인 필요');

// items, delivery, totalQuantity, totalPrice, userId, firstBookTitle

module.exports = {
    EMAIL_VALIDATION,
    PASSWORD_VALIDATION,
    BOOK_ID_VALIDATION,
    QUANTITY_VALIDATION,
    USER_ID_VALIDATION,
    CARTITEMS_ID_VALIDATION,
    SELECTED_VALIDATION,
    LIKED_BOOK_ID_VALIDATION,
};