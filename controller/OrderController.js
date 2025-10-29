const pool = require('../mariadb');
const {StatusCodes} = require('http-status-codes');

const order = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        
        const {items, delivery, totalQuantity, totalPrice, userId, firstBookTitle} = req.body;
        
        let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
        let values = [delivery.address, delivery.receiver, delivery.contact];
        
        let [results] = await conn.execute(sql, values);
        let delivery_id = results.insertId;

        sql = "INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)";
        values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
        [results] = await conn.execute(sql, values);
        let order_id = results.insertId;

        // items를 갖고, 장바구니에서 book_id, quantity 조회
        sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
        let [orderItems, fields] = await conn.query(sql, [items]);

        // orderedBook 테이블 삽입
        sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?";

        // items 배열: 요소들을 하나씩 꺼냄 (forEach)
        values = [];
        orderItems.forEach((item) => {
            values.push([order_id, item.book_id, item.quantity]);
        });
        results = await conn.query(sql, [values]);
        
        let result = await deleteCartItems(conn, items);

        return res.status(StatusCodes.OK).json(result);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
};

const deleteCartItems = async (conn, items) => {
    try {
        let sql = `DELETE FROM cartItems WHERE id IN (?)`;
        
        let result = await conn.query(sql, [items]);
        return result;
    } catch (err) {
        console.log(err);
        throw err;
    }
}

const getOrders = async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();

        let sql = `SELECT orders.id, created_at, address, receiver, contact,
                    book_title, total_quantity, total_price
                    FROM orders LEFT JOIN delivery
                    ON orders.delivery_id = delivery.id;`;

        let [rows, fields] = await conn.query(sql);
        return res.status(StatusCodes.OK).json(rows);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
}

const getOrderDetail = async (req, res) => {
    const { id } = req.params;
    let conn;
    try {
        conn = await pool.getConnection();

        let sql = `SELECT book_id, title, author, price, quantity
                    FROM orderedBook LEFT JOIN books ON orderedBook.book_id = books.id WHERE order_id = ?`;
        let [rows, fields] = await conn.query(sql, [id]);
        return res.status(StatusCodes.OK).json(rows);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
}

module.exports = {
    order,
    getOrders,
    getOrderDetail
};