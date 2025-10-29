const pool = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allCategory = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        
        let sql = "SELECT * FROM category";
        const [results] = await conn.query(sql);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    allCategory
};