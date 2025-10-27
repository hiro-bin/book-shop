const conn = require('../mariadb');
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

const join = (req, res) => {
        const {email, password} = req.body;

        let sql = `INSERT INTO users (email, password, salt) VALUES (?, ?, ?)`;

        const salt = crypto.randomBytes(SALT_BYTE_SIZE).toString('base64');
        const hashPassword = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('base64');
        let values = [email, hashPassword, salt];

        conn.query(sql, values, (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            return res.status(StatusCodes.CREATED).json(results);
        });
};

const login = (req, res) => {
    const {email, password} = req.body;

        // let sql = `SELECT * FROM users WHERE email = ? AND password = ?`;
        // let values = [email, password];
        // conn.query(sql, values, (err, results) => {
        //     if(err) {
        //         console.log(err);
        //         return res.status(StatusCodes.BAD_REQUEST).end();
        //     }
        let sql = `SELECT * FROM users WHERE email = ?`;
        conn.query(sql, email, (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            // const loginUser = results[0];
            // const token = jwt.sign({
            //     email: loginUser.email
            // }, process.env.PRIVATE_KEY, {
            //     expiresIn: '5m',
            //     issuer: 'songa'
            // });
            // console.log(token);

            // res.cookie("token", token, {
            //     httpOnly: true
            // });

            // return res.status(StatusCodes.OK).json(results);
            const loginUser = results[0];
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('base64');
            if(loginUser && loginUser.password == hashPassword) {
                const token = jwt.sign({
                    email: loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn: JWT_EXPIRATION_TIME,
                    issuer: JWT_ISSUER
                });
                console.log(token);

                res.cookie("token", token, {
                    httpOnly: true
                });

                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        });
};

const passwordResetRequest = (req, res) => {
    const {email} = req.body;

    let sql = `SELECT * FROM users WHERE email = ?`;
    conn.query(sql, email, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        const user = results[0];
        if(user) {
            return res.status(StatusCodes.OK).json({
                email: email
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    });
};

const passwordReset = (req, res) => {
    const {email, password} = req.body;

    let sql = `UPDATE users SET password = ?, salt = ? WHERE email = ?`;

    const salt = crypto.randomBytes(SALT_BYTE_SIZE).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('base64');

    let values = [hashPassword, salt, email];
    conn.query(sql, values, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        if(results.affectedRows == 0) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }
    });
};

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};