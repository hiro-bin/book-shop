const mariadb = require('mysql2/promise');

const connection = async() => {
    const conn = await mariadb.createConnection({
        host: process.env.HOST_NAME,
        user: process.env.USER_NAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        dateStrings: true
    });

    return conn;
};

module.exports = connection;