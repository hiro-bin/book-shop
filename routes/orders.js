const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

router.use(express.json());

router.post('/', (req, res) => {
    res.json('주문하기');
});

router.get('/', (req, res) => {
    res.json('주문 목록 조회');
});

router.get('/:orderId', (req, res) => {
    res.json('주문 상세 상품 조회');
});

module.exports = router;