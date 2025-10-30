const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { User } = require('../models');

const {
    SALT_BYTE_SIZE,
    HASH_ITERATIONS,
    HASH_KEY_LENGTH,
    HASH_ALGORITHM,
    JWT_EXPIRATION_TIME,
    JWT_ISSUER,
} = require('../utils/constants');

// join
const createUser = async (email, password) => {

        const salt = crypto.randomBytes(SALT_BYTE_SIZE).toString('base64');
        const hashPassword = crypto.pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('base64');
        
        const results = await User.create({
            email: email,
            password: hashPassword,
            salt: salt,
        });

        const resultsJSON = results.toJSON();

        return resultsJSON;
};

const foundUser = async (email) => {
    const user = await User.findOne({
        where: {
            email: email
        },
    });

    return user ? user.toJSON() : null;
};

const verifyUserCredentials = async (loginUser, password) => {
    if (!loginUser) {
        return false;
    }

    const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('base64');

    if(loginUser.password === hashPassword) {
        return loginUser;
    } else {
        return false;
    }

};

const generateAuthToken = async (loginUser) => {
    const token = jwt.sign({
        id: loginUser.id,
        email: loginUser.email
    }, process.env.PRIVATE_KEY, {
        expiresIn: JWT_EXPIRATION_TIME,
        issuer: JWT_ISSUER
    });

    return token;
};

module.exports = {
    createUser,
    foundUser,
    verifyUserCredentials,
    generateAuthToken,
}