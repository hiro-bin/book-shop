const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            models.User.hasMany(models.Likes, {
                foreignKey: 'user_id',
                sourceKey: 'id'
            });
            models.User.hasMany(models.Orders, {
                foreignKey: 'user_id',
                sourceKey: 'id'
            });
        }
    }
    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(45),
            allowNull: false
        },
        salt: {
            type: DataTypes.STRING(45),
            defaultValue: null
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        timestamps: false,
        underscored: true
    });

    return User;
}