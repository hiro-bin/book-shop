const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const { Order, Delivery, CartItem, OrderedBook } = require('../models');

const {
    SALT_BYTE_SIZE,
    HASH_ITERATIONS,
    HASH_KEY_LENGTH,
    HASH_ALGORITHM,
    JWT_EXPIRATION_TIME,
    JWT_ISSUER,
} = require('../utils/constants');

const createDelivery = async (delivery) => {
    const results = await Delivery.create({
        address: delivery.address,
        receiver: delivery.receiver,
        contact: delivery.contact,
    });

    return results.id;
};

const createOrder = async (firstBookTitle, totalQuantity, totalPrice, userId, deliveryId) => {
    const results = await Order.create({
        book_title: firstBookTitle,
        total_quantity: totalQuantity,
        total_price: totalPrice,
        user_id: userId,
        delivery_id: deliveryId
    });

    return results.id;
};

const getCartItems = async (items) => {
    const cartItems = await CartItem.findAll({
        attributes: ['book_id', 'quantity'],
        where: {
            id: {
                [Op.in]: items
            }
        },
    });

    return cartItems.map(item => item.toJSON());
};

const createOrderedBook = async (orderedBooks) => {
    const results = await OrderedBook.bulkCreate(orderedBooks);

    return results;
};

const deleteCartItems = async (items) => {
    return await CartItem.destroy({
        where: {
            id: {
                [Op.in]: items,
            },
        },
    });
};

module.exports = {
    createDelivery,
    createOrder,
    getCartItems,
    createOrderedBook,
    deleteCartItems,
}
