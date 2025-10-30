const pool = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userService = require('../service/userService');

const join = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const {email, password} = req.body;

        const results = await userService.createUser(email, password);

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

        const users = await userService.foundUser(email);

        const loginUser = users;

        const verifyUser = await userService.verifyUserCredentials(loginUser, password);

        if(verifyUser) {
            const token = await userService.generateAuthToken(verifyUser);
        
            res.cookie("token", token, {
                httpOnly: true
            });
            return res.status(StatusCodes.OK).json(verifyUser);
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