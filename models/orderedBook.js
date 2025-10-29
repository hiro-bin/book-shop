const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderdBook extends Model {
        static associate(models) {
            models.OrderdBook.belongsTo(models.Book, {
                foreignKey: 'book_id',
                targetKey: 'id'
            });
            models.OrderdBook.belongsTo(models.Order, {
                foreignKey: 'order_id',
                targetKey: 'id'
            });
        }
    }
    OrderdBook.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'orders',
                key: 'id',
            },
            constraints: {
                name: 'fk_orderedBook_orders_id'
            }
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'books',
                key: 'id',
            },
            constraints: {
                name: 'fk_orderedBook_books_id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'OrderdBook',
        tableName: 'orderedBook',
        timestamps: false,
        underscored: true
    });

    return OrderdBook;
}