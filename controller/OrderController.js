//const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const {StatusCodes} = require('http-status-codes');

const order = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: process.env.HOST_NAME,
        user: process.env.USER_NAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
        dateStrings: true
    });
    
    const {items, delivery, totalQuantity, totalPrice, userId, firstBookTitle} = req.body;

    let delivery_id;
    let order_id;
    
    let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?)";
    let values = [delivery.address, delivery.receiver, delivery.contact];
    let [results] = await conn.query(sql, values);
    delivery_id = results.insertId;
    console.log(results);

    sql = "INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)";
    values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
    [results] = await conn.query(sql, values);
    order_id = results.insertId;
    console.log(results);

    sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?";
    // items 배열: 요소들을 하나씩 꺼냄 (forEach)
    values = [];
    items.forEach((item) => {
        values.push([order_id, item.book_id, item.quantity]);
    });
    [results] = conn.query(sql, [values]);
    return res.status(StatusCodes.OK).json(results);
};

const getOrders = (req, res) => {
    const {user_id, selected} = req.body;
    let sql = "INSERT INTO orderedBook (order_id, book_id, quantity) VALUES (order_id, 1, 1)";
    let values = [user_id, selected];
    conn.query(sql, values, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(results);
    });
}

const getOrderDetail = (req, res) => {
    const {id} = req.params;
    let sql = "DELETE FROM cartItems WHERE id = ?";
    conn.query(sql, id, (err, results) => {
        if(err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        return res.status(StatusCodes.OK).json(results);
    });
}

module.exports = {
    order,
    getOrders,
    getOrderDetail
};