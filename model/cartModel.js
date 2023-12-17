let { Cart } = require('../schema/cartSchema')
let joi = require('joi')
let { Product } = require('../schema/productSchema')
let { User } = require('../schema/userSchema')
async function checkCreate(data) {
    let schema = joi.object({
        productID: joi.number().required(),
        qty: joi.number().required(),
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: valid.error }
    }
    return { data: valid }
}
async function create(id, params, userData) {
    params.id = id
    let valid = await checkCreate(params).catch((error) => { return { error } })
    console.log("🚀 ~ file: cartModel.js:22 ~ create ~ valid:", valid)
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let cartData = {
        productID: params.id,
        userID: userData.id,
        qty: params.qty
    }
    let findProduct = await Product.findOne({ where: { id: cartData.productID } }).catch((error) => { return { error } })
    if (!findProduct || (findProduct && findProduct.error)) {
        return { error: "Product not found" }
    }
    if (cartData.qty > findProduct.quantity) {
        return { error: "Out of stock" }
    }
    let findUser = await User.findOne({ where: { id: cartData.userID } }).catch((error) => { return { error } })
    if (!findUser || (findUser && findUser.error)) {
        return { error: "User not found" }
    }
    cartData.totalAmount = cartData.qty * findProduct.price
    let data = await Cart.create(cartData).catch((error) => { return { error } })
    console.log("🚀 ~ file: cartModel.js:41 ~ create ~ data:", data)
    if (!data || (data && data.error)) {
        return { error: 'Error creating new cart' }
    }
    return { data }
}
async function viewAll(userData) {
    let data = await Cart.findAll({ where: { userID: userData.id } }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: "Cart not found" }
    }
    return { data }
}
async function checkUpdate(data) {
    let schema = joi.object({
        qty: joi.number().required(),
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: valid.error }
    }
    return { data: valid }
}
async function update(id, params, userData) {
    let valid = await checkUpdate(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findCart = await Cart.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!findCart || (findCart && findCart.error)) {
        return { error: "Cart not found" }
    }
    let findProduct = await Product.findOne({ where: { id: findCart.productID } }).catch((error) => { return { error } })
    if (!findProduct || (findProduct && findProduct.error)) {
        return { error: "Product not found" }
    }
    if (params.qty >= findProduct.quantity) {
        return { error: "Product out of stock" }
    }
    let findUser = await User.findOne({ where: { id: userData.id } }).catch((error) => { return { error } })
    if (!findUser || (findUser && findUser.error)) {
        return { error: "User not found" }
    }
    let data = {
        qty: params.qty,
        totalAmount: params.qty * findProduct.price
    }
    let upCart = await Cart.update(data, { where: { id: findCart.id } }).catch((error) => { return { error } })
    if (!upCart || (upCart && upCart.error)) {
        return { error: "Cant Update" }
    }
    return { data }
}
async function cartDelete(id, userData) {
    let findCart = await Cart.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!findCart || (findCart && findCart.error)) {
        return { error: "Cart not found" }
    }
    let findUser = await User.findOne({ where: { id: userData.id } }).catch((error) => { return { error } })
    if (!findUser || (findUser && findUser.error)) {
        return { error: "User not found" }
    }
    if (findUser.id != findCart.userID) {
        return { error: "Unauthorized" }
    }
    let data = await Cart.destroy({ where: { userID: userData.id } }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: "Cant Delete" }
    }
    return { data }
}
module.exports = {
    create,
    viewAll,
    update,
    cartDelete
}