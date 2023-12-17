let { sequelizeCon, Model, DataTypes } = require('../init/dbconfig')
class UserPermission extends Model { }
UserPermission.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    userID: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    permissionID: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, { tableName: 'userpermission', modelName: 'UserPermission', sequelize: sequelizeCon })

module.exports = { UserPermission }