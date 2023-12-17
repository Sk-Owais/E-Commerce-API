let { User } = require('../schema/userSchema')
let joi = require('joi')
let security = require('../helper/security')
let { UserPermission } = require('../schema/userPermissionSchema')
let otpgenerate = require('otp-generator')
let { mail } = require('../helper/mailer')

async function checkRegister(data) {
    let schema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        contact: joi.string().required(),
        password: joi.string().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg, status: 403 }
    }
    return { data: valid }
}

async function register(params) {
    let valid = await checkRegister(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: 'validation error', status: 403 }
    }
    let findUser = await User.findOne({ where: { email: params.email } }).catch((error) => { return { error } })
    if (findUser || (findUser && findUser.error)) {
        return { error: "Already Exists", status: 403 }
    }
    let msgDig = await security.hash(params.password).catch((error) => {
        return { error }
    })
    if (!msgDig || (msgDig && msgDig.error)) {
        return { error: 'hashing error' }
    }
    let userData = {
        name: params.name,
        email: params.email,
        contact: params.contact,
        password: msgDig.data
    }
    let data = await User.create(userData).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        return { error: 'Internal Server Error', status: 500 }
    }
    let userPermission = {
        userID: data.id,
        permissionID: 1
    }
    let upData = await UserPermission.create(userPermission).catch((error) => { return { error } })
    if (!upData || (upData && upData.error)) {
        return { error: 'Internal Server Error', status: 500 }
    }
    return { data }
}

async function checkLogin(data) {
    let schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required()
    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message)
        }
        return { error: msg, status: 403 }
    }
    return { data: valid }
}
async function login(params) {
    let valid = await checkLogin(params, { abortEarly: false }).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: 'validation error', status: 403 }
    }
    let find = await User.findOne({ where: { email: params.email } }).catch((error) => { return { error } })
    if (!find || (find && find.error)) {
        return { error: 'User not found', status: 204 }
    }
    let confirmation = await security.compare(params.password, find.password).catch((error) => { return { error } })
    if (!confirmation || (confirmation && confirmation.error)) {
        return { error: 'Invalid Password', status: 401 }
    }
    let token = await security.encrypt({ id: find.id }, "#OS@11@SO#").catch((error) => { return { error } })
    if (!token || (token && token.error)) {
        return { error: token.error }
    }
    let upToken = await User.update({ token }, { where: { id: find.id } }).catch((error) => { return { error } })
    if (!upToken || (upToken && upToken.error)) {
        return { error: 'Internal Server Error', status: 500 }
    }
    return { token: token }
}
async function checkForP(params) {
    let schema = joi.object({
        email: joi.string().required()
    })
    let valid = await schema.validateAsync(params, { abortEarly: false }).catch((error) => {
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

async function forgetPassword(params) {
    let valid = await checkForP(params).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let find = await User.findOne({ where: { email: params.email } }).catch((error) => {
        return { error }
    })
    console.log("🚀 ~ file: authModel.js:127 ~ forgetPassword ~ find:", find)
    if (!find || (find && find.error)) {
        return { error: 'user not found' }
    }
    let otp = await otpgenerate.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
    let hashOtp = await security.hash(otp).catch((error) => {
        return { error }
    })
    if (!hashOtp || (hashOtp && hashOtp.error)) {
        return { error: hashOtp.error }
    }
    let saveOtp = await User.update({ otp: hashOtp.data }, { where: { id: find.id } }).catch((error) => {
        return { error }
    })
    if (!saveOtp || (saveOtp && saveOtp.error)) {
        return { error: saveOtp.error }
    }
    let mailOption = {
        from: 'oshaik427@gmail.com',
        to: params.email,
        subject: "Hello",
        text: `This is your otp ${otp}`
    }
    let sendMail = await mail(mailOption).catch((error) => {
        return { error }
    })
    if (!sendMail || (sendMail && sendMail.error)) {
        return { error: "mail cannot sent" }
    }
    return { data: `mail is send to ${params.email}` }
}
async function checkPRes(data) {
    let schema = joi.object({
        email: joi.string().required(),
        otp: joi.string().required(),
        password: joi.string().required()
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
async function pReset(email, params) {
    params.email = email
    let valid = await checkPRes(params).catch((error) => { return { error } })
    if (!valid || (valid && valid.error)) {
        return { error: valid.error }
    }
    let findUser = await User.findOne({ where: { email: params.email } }).catch((error) => { return { error } })
    console.log("🚀 ~ file: authModel.js:183 ~ pReset ~ findUser:", findUser)
    if (!findUser || (findUser && findUser.error)) {
        return { error: "User in not found" }
    }
    let check = await security.compare(params.otp, findUser.otp).catch((error) => { return { error } })
    if (!check || (check && check.error)) {
        return { error: "Op does not match" }
    }
    let password = await security.hash(params.password).catch((error) => { return { error } })
    if (!password || (password && password.error)) {
        return { error: "password.error" }
    }
    let resetPassword = await User.update({password:password.data}, { where: { id: findUser.id } }).catch((error) => {
        return { error }
    })
    console.log("🚀 ~ file: authModel.js:198 ~ pReset ~ resetPassword:", resetPassword)
    if (!resetPassword || (resetPassword && resetPassword.error)) {
        return { error: "Cannnot update password" }
    }
    return { data: "Password is reset" }
}
module.exports = {
    register,
    login,
    forgetPassword,
    pReset
}