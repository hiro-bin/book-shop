const pool = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let { category_id, news, limit, currentPage } = req.query;

        // limit: page 당 도서 수
        // currentPage: 현재 페이지
        // offset = limit*(currentPage-1)
        let offset = limit * (currentPage - 1);
        let sql = "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books";
        let values = [];
        if(category_id && news) {
            sql += " WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
            values = [category_id];
        } else if(category_id) {
            sql += " WHERE category_id = ?";
            values = [category_id];
        } else if(news) {
            sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        }

        sql += " LIMIT ? OFFSET ?"
        values.push(parseInt(limit), offset);

        const [results] = await conn.query(sql, values);
        if(results.length) return res.status(StatusCodes.OK).json(results);
        else return res.status(StatusCodes.NOT_FOUND).end();
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
};

const bookDetail = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let {user_id} = req.body;
        let book_id = req.params.id;
        let sql = "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes, EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?) AS liked FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?";
        let values = [user_id, book_id, book_id];
        const [results] = await conn.query(sql, values);
        if(results[0]) return res.status(StatusCodes.OK).json(results[0]);
        else return res.status(StatusCodes.NOT_FOUND).end();
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
};

module.exports = {
    allBooks,
    bookDetail,
};