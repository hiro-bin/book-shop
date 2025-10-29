const pool = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const {
    SALT_BYTE_SIZE,
    HASH_ITERATIONS,
    HASH_KEY_LENGTH,
    HASH_ALGORITHM,
    JWT_EXPIRATION_TIME,
    JWT_ISSUER,
} = require('../utils/constants');

const join = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const {email, password} = req.body;

        let sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;

        const salt = crypto.randomBytes(SALT_BYTE_SIZE).toString('base64');
        const hashPassword = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('base64');
        let values = [email, hashPassword, salt];

        const [results] = await conn.query(sql, values);
        return res.status(StatusCodes.CREATED).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
};

const login = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const {email, password} = req.body;

        let sql = `SELECT * FROM users WHERE email = ?`;
        const [results] = await conn.query(sql, email);

        const loginUser = results[0];
        const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('base64');
        
        if(loginUser && loginUser.password == hashPassword) {
            const token = jwt.sign({
                id: loginUser.id,
                email: loginUser.email
            }, process.env.PRIVATE_KEY, {
                expiresIn: JWT_EXPIRATION_TIME,
                issuer: JWT_ISSUER
            });

            res.cookie("token", token, {
                httpOnly: true
            });
            console.log(token);

            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
};

const passwordResetRequest = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const {email} = req.body;

        let sql = `SELECT * FROM users WHERE email = ?`;
        const [results] = await conn.query(sql, email);

        const user = results[0];
        if(user) {
            return res.status(StatusCodes.OK).json({
                email: email
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
};

const passwordReset = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const {email, password} = req.body;

        let sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;

        const salt = crypto.randomBytes(SALT_BYTE_SIZE).toString('base64');
        const hashPassword = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('base64');

        let values = [hashPassword, salt, email];
        const [results] = await conn.query(sql, values);

        if(results.affectedRows == 0) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};