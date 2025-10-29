const mariadb = require('mysql2/promise');

const pool = mariadb.createPool({
        host: process.env.HOST_NAME,
        user: process.env.USER_NAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        dateStrings: true
    });

module.exports = pool;