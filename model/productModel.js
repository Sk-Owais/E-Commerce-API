//this contain all business logic 
//joi will be export here
let { Product } = require('../schema/productSchema')
let joi = require('joi')
async function create(params) {
    let valid = await checkCreate(params).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let productData = {
        name: params.name,
        price: params.price,
        quantity: params.quantity,
        description: params.description,
        discount: params.discount,
        gst: params.gst
    }
    let data = await Product.create(productData).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        return { error: 'internal server error' }
    }
    return { data: data }
}
async function checkCreate(data) {
    let schema = joi.object({
        name: joi.string().required(),
        price: joi.number().required(),
        quantity: joi.number().required(),
        description: joi.string().required(),
        discount: joi.number().required(),
        gst: joi.number().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function viewAll(params, permissions) {
    let limit = (params.limit) ? parseInt(params.limit) : 10;
    let page = (params.page) ? parseInt(params.page) : 1;
    let offset = (page - 1) * limit
    console.log("🚀 ~ file: productModel.js:53 ~ viewAll ~ offset:", offset)

    let where = {}
    if (!permissions.product_restore) {
        where = { is_deleted: false }
    }
    let counter = await Product.count({ where }).catch((error) => {
        return { error }
    })
    if (!counter || (counter && counter.error)) {
        return { error: 'Internal Server Error' }
    }
    if (counter <= 0) {
        return { error: 'No products found' }
    }
    let data = await Product.findAll({ limit, offset, raw: true, where }).catch((error) => {
        return { error }
    })

    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    return { data: data, total: counter, page, limit, totalPages: Math.ceil(counter / limit), count: data.length }
}
async function viewDetails(id) {
    let valid = await check({ id }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Product.findOne({ where: { id } }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    return { data: data }
}
async function update(id, params) {
    params.id = id
    let valid = await checkUpdate(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Product.findOne({ where: { id }, raw: true }).catch((error) => { return { error } })
    console.log("🚀 ~ file: productModel.js:92 ~ update ~ data:", data)

    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    data.name = params.name
    data.price = params.price
    data.quantity = params.quantity
    data.description = params.desc
    data.discount = params.discount
    data.gst = params.gst
    let updateProduct = await Product.update(data, { where: { id } }).catch((error) => {
        return { error }
    })
    if (!updateProduct || (updateProduct && updateProduct.error)) {
        return { error: 'internal server error', status: 500 }
    }
    return { data: data }
}
async function checkUpdate(data) {
    let schema = joi.object({
        id: joi.number(),
        name: joi.string(),
        price: joi.number(),
        quantity: joi.number(),
        description: joi.string(),
        discount: joi.number(),
        gst: joi.number()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}
async function pDelete(id, decision) {
    let valid = await check({ id }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let data = await Product.findOne({ where: { id }, raw: true }).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: 'internal server error', status: 500 }
    }
    if (data.is_deleted == decision) {
        return { error: 'This product is already deleted' }
    }
    let updateProduct = await Product.update({ is_deleted: decision }, { where: { id } }).catch((error) => {
        return { error }
    })
    if (!updateProduct || (updateProduct && updateProduct.error)) {
        return { error: 'internal server error', status: 500 }
    }
    if (updateProduct <= 0) {
        return { error: 'product not found' }
    }
    return { data: 'Record deleted successfully' }
}
async function check(data) {
    let schema = joi.object({
        id: joi.number().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg }
    }
    return { data: valid }
}

module.exports = {
    create,
    viewAll,
    viewDetails,
    update,
    pDelete
}