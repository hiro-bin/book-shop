const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const pool = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addToCart = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const {book_id, quantity} = req.body;

        let authorization = ensureAuthorization(req, res);

        if(authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
            });
        } else if(authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message": "잘못된 토큰입니다."
            });
        } else {
            let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)";
            let values = [book_id, quantity, authorization.id];
            const [results] = await conn.query(sql, values);
            return res.status(StatusCodes.OK).json(results);
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
};

const getCartItems = async (req, res) => {

    let conn;
    try {
        conn = await pool.getConnection();
        const {selected} = req.body;

        let authorization = ensureAuthorization(req, res);

        if(authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
            });
        } else if(authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message": "잘못된 토큰입니다."
            });
        } else {
            let sql = "SELECT cartItems.id, book_id, title, summary, quantity, price FROM cartItems LEFT JOIN books ON cartItems.book_id = books.id WHERE user_id = ? AND cartItems.id IN (?) ";
            let values = [authorization.id, selected];
            const [results] = await conn.query(sql, values);
            return res.status(StatusCodes.OK).json(results);
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
}

const removeCartItem = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const cartItemId = req.params.id;
        let sql = "DELETE FROM cartItems WHERE id = ?";
        const [results] = await conn.query(sql, cartItemId);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
}

function ensureAuthorization(req, res) {
    try {
        let receivedJwt = req.headers["authorization"];
        let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        return decodedJwt;
    } catch(err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
};