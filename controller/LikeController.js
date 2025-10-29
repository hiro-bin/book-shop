const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const pool = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const addLike = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const book_id = req.params.id;
        
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
            let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";
            let values = [authorization.id, book_id];
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

const removeLike = async (req, res) => {

    let conn;
    try {
        conn = await pool.getConnection();
        const book_id = req.params.id;

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
            let sql = "DELETE FROM likes WHERE user_id = ? AND liked_book_id = ? ";
            let values = [authorization.id, book_id];
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
    addLike,
    removeLike
};