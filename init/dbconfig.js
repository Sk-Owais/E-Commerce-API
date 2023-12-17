let { Sequelize, Model, DataTypes, Op, QueryTypes } = require('sequelize')
let config = require('config')
let mysqlConfig = config.get("mysql")
let sequelizeCon = new Sequelize(mysqlConfig)

sequelizeCon.authenticate().then(() => {
    console.log("Connected to Database")
}).catch((error) => {
    console.log("Connection to Database could not established", error);
})

module.exports = {
    sequelizeCon,
    Model,
    DataTypes,
    Op,
    QueryTypes
}