const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Like extends Model {
        static associate(models) {
            models.Likes.belongsTo(models.User, {
                foreignKey: 'user_id',
                targetKey: 'id'
            });
            models.Likes.belongsTo(models.Book, {
                foreignKey: 'liked_book_id',
                targetKey: 'id'
            });
        }
    }
    Like.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'users',
                key: 'id',
            },
        },
        liked_book_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Like',
        tableName: 'likes',
        timestamps: false,
        underscored: true
    });

    return Like;
}