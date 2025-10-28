const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Likes extends Model {
        static associate(models) {
            models.Likes.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'id'
            });
        }
    }
    Likes.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        liked_book_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Likes',
        tableName: 'likes',
        timestamps: false,
        underscored: true
    });

    return Likes;
}