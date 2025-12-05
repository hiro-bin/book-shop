const ensureAuthorization = require('../auth');
const jwt = require('jsonwebtoken');
const pool = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const orderService = require('../service/orderService');

const order = async (req, res) => {
    try {
        let authorization = ensureAuthorization(req, res);

        if(authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
            });
        } else if(authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message": "잘못된 토큰입니다."
            });
        } else {
            const {items, delivery, totalQuantity, totalPrice, firstBookTitle} = req.body;
            
            const userId = authorization.id;
            
            let deliveryId = await orderService.createDelivery(delivery);
            
            let orderId = await orderService.createOrder(firstBookTitle, totalQuantity, totalPrice, userId, deliveryId);

            let cartItems = await orderService.getCartItems(items);
            
            const orderedBooks = cartItems.map((item) => ({
                order_id: orderId,
                book_id: item.book_id,
                quantity: item.quantity,
            }));
            
            await orderService.createOrderedBook(orderedBooks);
            
            const result = await orderService.deleteCartItems(items);

            return res.status(StatusCodes.OK).json(result);
        }

    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

const getOrders = async (req, res) => {
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
        } else {
            let sql = `SELECT orders.id, created_at, address, receiver, contact,
                        book_title, total_quantity, total_price
                        FROM orders LEFT JOIN delivery
                        ON orders.delivery_id = delivery.id
                        WHERE orders.user_id = ?;`;

            let [rows, fields] = await conn.query(sql, [authorization.id]);

            const camelCaseRows = rows.map(row => {
                const newRow = {};
                for (const key in row) {
                    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
                    newRow[camelKey] = row[key];
                }
                return newRow;
            });

            return res.status(StatusCodes.OK).json(camelCaseRows);
        }
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    } finally {
        if (conn) conn.release();
    }
}

const getOrderDetail = async (req, res) => {
    const orderId = req.params.id;
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
        } else {
            let sql = `SELECT book_id, title, author, price, quantity
                        FROM orderedBook LEFT JOIN books ON orderedBook.book_id = books.id WHERE order_id = ?`;
            let [rows, fields] = await conn.query(sql, [orderId]);
            return res.status(StatusCodes.OK).json(rows);
        }
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
