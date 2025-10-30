const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            models.Order.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'id'
            });
            models.Order.belongsTo(models.Delivery, {
                foreignKey: 'delivery_id',
                targetKey: 'id'
            });
            models.Order.hasMany(models.OrderedBook, {
                foreignKey: 'order_id',
                sourceKey: 'id'
            });
        }
    }
    Order.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        book_title: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        total_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        total_price: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
            constraints: {
                name: 'fk_orders_users_id'
            }
        },
        delivery_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'delivery',
                key: 'id',
            },
            constraints: {
                name: 'fk_orders_delivery_id'
            }
        },
    }, {
        sequelize,
        modelName: 'Order',
        tableName: 'orders',
        timestamps: false,
        underscored: true
    });

    return Order;
}