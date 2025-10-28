const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Book extends Model {
        static associate(models) {
            models.Book.belongsTo(models.Category, {
                foreignKey: 'category_id',
                sourceKey: 'category_id'
            });
            models.Book.hasMany(models.Likes, {
                foreignKey: 'liked_book_id',
                sourceKey: 'id'
            });
        }
    }
    Book.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        img: {
            type: DataTypes.INTEGER,
            defaultValue: null
        },
        category_id: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        form: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        isbn: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
            defaultValue: null
        },
        summary: {
            type: DataTypes.STRING(45),
            defaultValue: null
        },
        detail: {
            type: DataTypes.STRING(500),
            defaultValue: null
        },
        author: {
            type: DataTypes.TEXT('long'),
            defaultValue: null
        },
        pages: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        contents: {
            type: DataTypes.TEXT('long'),
            defaultValue: null
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        pub_date: {
            type: DataTypes.DATE,
            defaultValue: null
        },
    }, {
        sequelize,
        modelName: 'Book',
        tableName: 'books',
        timestamps: false,
        underscored: true
    });

    return Book;
}