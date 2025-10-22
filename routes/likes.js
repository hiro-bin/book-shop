const express = require('express');
const router = express.Router();
const {addLike, removeLike} = require('../controller/LikeController');
const dotenv = require('dotenv');

dotenv.config();

router.use(express.json());

router.post('/:id', addLike);

router.delete('/:id', removeLike);

module.exports = router;