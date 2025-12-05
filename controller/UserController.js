const {StatusCodes} = require('http-status-codes');
const crypto = require('crypto');

const userService = require('../service/userService');

const join = async (req, res) => {
    try {
        const {email, password} = req.body;

        const results = await userService.createUser(email, password);

        if(results) return res.status(StatusCodes.CREATED).json(results);
        else res.status(StatusCodes.BAD_REQUEST).end();
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const loginUser = await userService.foundUser(email);

        const verifyUser = await userService.verifyUserCredentials(loginUser, password);

        if(verifyUser) {
            const token = await userService.generateAuthToken(verifyUser);
        
            res.cookie("token", token, {
                httpOnly: true
            });
            console.log(`token: ${token}`);

            return res.status(StatusCodes.OK).json({...verifyUser, token: token});
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const passwordResetRequest = async (req, res) => {
    try {
        const {email} = req.body;

        const loginUser = await userService.foundUser(email);

        if(loginUser) {
            return res.status(StatusCodes.OK).json({
                email: email
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const passwordReset = async (req, res) => {
    try {
        const {email, password} = req.body;

        const results = await userService.resetPassword(email, password);

        if(results) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

module.exports = {
    join,
    login,
    passwordResetRequest,
    passwordReset
};