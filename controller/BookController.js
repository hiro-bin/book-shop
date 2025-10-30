const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');
const pool = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const allBooks = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        let allBooksRes = {};
        let { category_id, news, limit, currentPage } = req.query;

        // limit: page 당 도서 수
        // currentPage: 현재 페이지
        // offset = limit*(currentPage-1)
        let offset = limit * (currentPage - 1);
        let sql = "SELECT SQL_CALC_FOUND_ROWS *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books";
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
        if(results.length) {
            results.map((result) => {
                result.pubDate = result.pub_date;
                delete result.pub_date;
            });
            allBooksRes.books = results;
        }
        else return res.status(StatusCodes.NOT_FOUND).end();

        sql = "SELECT found_rows()";

        const [result] = await conn.query(sql);

        let pagination = {};
        pagination.currentPage = parseInt(currentPage);
        pagination.totalCount = result[0]["found_rows()"];

        allBooksRes.pagination = pagination;

        return res.status(StatusCodes.OK).json(allBooksRes);
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

        let authorization = ensureAuthorization(req, res);

        if(authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
            });
        } else if(authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message": "잘못된 토큰입니다."
            });
        } else if(authorization instanceof ReferenceError) {
            let book_id = req.params.id;
            let sql = "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?";
            let values = [book_id];
            const [results] = await conn.query(sql, values);
            if(results[0]) return res.status(StatusCodes.OK).json(results[0]);
            else return res.status(StatusCodes.NOT_FOUND).end();
        } else {
            let book_id = req.params.id;
            let sql = "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes, EXISTS (SELECT * FROM likes WHERE user_id = ? AND liked_book_id = ?) AS liked FROM books LEFT JOIN category ON books.category_id = category.category_id WHERE books.id = ?";
            let values = [authorization.id, book_id, book_id];
            const [results] = await conn.query(sql, values);
            if(results[0]) return res.status(StatusCodes.OK).json(results[0]);
            else return res.status(StatusCodes.NOT_FOUND).end();
        }
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