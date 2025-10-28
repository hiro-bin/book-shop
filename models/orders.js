const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Orders extends Model {
        static associate(models) {
            models.Orders.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'id'
            });
            models.Orders.belongsTo(models.User, {
                foreignKey: 'delivery_id',
                targetKey: 'id'
            });
        }
    }
    Orders.init({
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
            type: DataTypes.TIMESTAMP,
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
                model: 'likes',
                key: 'id',
            },
            constraints: {
                name: 'fk_orders_delivery_id'
            }
        },
    }, {
        sequelize,
        modelName: 'Orders',
        tableName: 'orders',
        timestamps: false,
        underscored: true
    });

    return Orders;
}