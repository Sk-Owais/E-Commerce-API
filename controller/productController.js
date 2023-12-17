let productModel = require('../model/productModel')
async function create(req, res) {
    let modelData = await productModel.create(req.body).catch((error) => {
        return { error }
    })
    if (!modelData || (modelData && modelData.error)) {
        let error = (modelData && modelData.error) ? modelData.error : 'internal server error'
        return res.send({ error })
    }
    return res.send({ data: modelData.data })
}
async function viewAll(req, res) {
    let products = await productModel.viewAll(req.query, req.userData.permissions).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        return res.send({ error: products.error })
    }
    return res.send({ products: products.data, page: products.page, limit: products.limit, total: products.total, totalPages: products.totalPages, count: products.count })
}
async function viewDetails(req, res) {
    let products = await productModel.viewDetails(req.params.id).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        return res.send({ error: products.error })
    }
    return res.send({ products: products.data })
}
async function update(req, res) {
    let products = await productModel.update(req.params.id, req.body).catch((error) => {
        return { error }
    })
    console.log("🚀 ~ file: productController.js:34 ~ update ~ products:", products)

    if (!products || (products && products.error)) {
        return res.send({ error: products.error })
    }
    return res.send({ data: "Update Succesful" })
}
async function pDelete(req, res) {
    let products = await productModel.pDelete(req.params.id, true).catch((error) => {
        return { error }
    })
    if (!products || (products && products.error)) {
        return res.send({ error: products.error })
    }
    return res.send({ data: "product deleted" })
}

async function restore(req, res) {
    let products = await productModel.pDelete(req.params.id, false).catch((error) => { return { error } })
    console.log('p', products)
    if (!products || (products && products.error)) {
        return res.send({ error: products.error })
    }
    return res.send({ data: products.data })
}

module.exports = {
    create,
    viewAll,
    viewDetails,
    update,
    pDelete,
    restore
}