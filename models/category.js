const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Category extends Model {
        static associate(models) {

        }
    }
    Category.init({
        category_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        category_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Category',
        tableName: 'category',
        timestamps: false,
        underscored: true
    });

    return Category;
}