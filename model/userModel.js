let { User } = require('../schema/userSchema')
let joi = require('joi')

async function check(data) {
    let schema = joi.object({
        name: joi.string(150).required(),
        email: joi.string(255).required(),
        contact: joi.string(16).required(),
        password: joi.string(30).required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error.details)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg, status: 403 }
    }
    return { data: valid }
}

async function create(params) {
    let valid = await check(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: 'validation error', status: 403 }
    }
    let userData = {
        name: params.name,
        email: params.email,
        contact: params.contact,
        password: params.passwordS
    }
    let data = await User.create(userData).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: 'Error in creating new user', status: 409 }
    }
    return { data }
}

module.exports={
    create
}