const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CartItem extends Model {
        static associate(models) {
            models.CartItem.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'id'
            });
            models.CartItem.belongsTo(models.Book, {
                foreignKey: 'book_id',
                targetKey: 'id'
            });
        }
    }
    CartItem.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        book_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'books',
                key: 'id',
            },
            constraints: {
                name: 'fk_cartItems_books_id'
            }
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            constraints: {
                name: 'fk_cartItems_users_id'
            }
        }
    }, {
        sequelize,
        modelName: 'CartItem',
        tableName: 'cartItems',
        timestamps: false,
        underscored: true
    });

    return CartItem;
}