const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderedBook extends Model {
        static associate(models) {
            models.OrderedBook.belongsTo(models.Book, {
                foreignKey: 'book_id',
                targetKey: 'id'
            });
            models.OrderedBook.belongsTo(models.Order, {
                foreignKey: 'order_id',
                targetKey: 'id'
            });
        }
    }
    OrderedBook.init({
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
        modelName: 'OrderedBook',
        tableName: 'orderedBook',
        timestamps: false,
        underscored: true
    });

    return OrderedBook;
}