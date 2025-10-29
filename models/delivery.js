const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Delivery extends Model {
        static associate(models) {
            models.Delivery.hasMany(models.Order, {
                foreignKey: 'delivery_id',
                sourceKey: 'id'
            });
        }
    }
    Delivery.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(500),
            allowNull: false
        },
        receiver: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        contact: {
            type: DataTypes.STRING(45),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Delivery',
        tableName: 'delivery',
        timestamps: false,
        underscored: true
    });

    return Delivery;
}