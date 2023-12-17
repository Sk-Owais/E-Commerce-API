let { sequelizeCon, Model, DataTypes, } = require('../init/dbconfig')

class Permission extends Model { }
Permission.init({
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
}, { tableName: 'permission', modelName: 'Permission', sequelize: sequelizeCon })

module.exports = { Permission }