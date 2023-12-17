let cartModel = require('../model/cartModel')
async function create(req, res) {
    let cart = await cartModel.create(req.params.id, req.body, req.userData).catch((error) => { return { error } })
    console.log("🚀 ~ file: cartController.js:4 ~ create ~ cart:", cart)
    if (!cart || (cart && cart.error)) {
        let error = (cart && cart.error) ? cart.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: cart.data })
}
async function viewAll(req, res) {
    let cart = await cartModel.viewAll(req.userData).catch((error) => { return { error } })
    console.log("🚀 ~ file: cartController.js:4 ~ create ~ cart:", cart)
    if (!cart || (cart && cart.error)) {
        let error = (cart && cart.error) ? cart.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: cart.data })
}
async function update(req, res) {
    let cart = await cartModel.update(req.params.id, req.body, req.userData).catch((error) => { return { error } })
    console.log("🚀 ~ file: cartController.js:4 ~ create ~ cart:", cart)
    if (!cart || (cart && cart.error)) {
        let error = (cart && cart.error) ? cart.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: cart.data, msg: "Cart Updated" })
}
async function cartDelete(req, res) {
    let cart = await cartModel.cartDelete(req.params.id, req.userData).catch((error) => { return { error } })
    console.log("🚀 ~ file: cartController.js:4 ~ create ~ cart:", cart)
    if (!cart || (cart && cart.error)) {
        let error = (cart && cart.error) ? cart.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: "Cart Deleted" })
}
module.exports = {
    create,
    viewAll,
    update,
    cartDelete
}
