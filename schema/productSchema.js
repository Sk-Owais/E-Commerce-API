let { sequelizeCon, Model, DataTypes } = require('../init/dbconfig')
class Product extends Model { }
Product.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(150),
        allowNull: false
    },
    price: {
        type: DataTypes.STRING(30),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    discount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gst: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, { tableName: "product", modelName: "Product", sequelize: sequelizeCon })

module.exports = {
    Product
}