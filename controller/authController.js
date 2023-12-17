let authModel = require('../model/authModel')

async function register(req, res) {
    let regData = await authModel.register(req.body).catch((error) => { return { error } })
    if (!regData || (regData && regData.error)) {
        let error = (regData && regData.error) ? regData.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data: regData.data })
}

async function login(req, res) {
    let logData = await authModel.login(req.body).catch((error) => { return { error } })
    console.log("🚀 ~ file: authController.js:14 ~ login ~ logData:", logData)
    if (!logData || (logData && logData.error)) {
        let error = (logData && logData.error) ? logData.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.header({ token: logData.token }).send({ data: "Login Success" })
}
async function forgetPassword(req, res) {
    let forgetData = await authModel.forgetPassword(req.body).catch((error) => {
        return { error }
    })
    console.log("1", forgetData);
    if (!forgetData || (forgetData && forgetData.error)) {
        let error = (forgetData && forgetData.error) ? forgetData.error : "internal server error"
        return res.send({ error })
    }
    return res.send({ data: forgetData })
}
async function pReset(req, res) {
    let forgetData = await authModel.pReset(req.params.email,req.body).catch((error) => {
        return { error }
    })
    console.log("1", forgetData);
    if (!forgetData || (forgetData && forgetData.error)) {
        let error = (forgetData && forgetData.error) ? forgetData.error : "internal server error"
        return res.send({ error })
    }
    return res.send({ data: forgetData })
}

module.exports = {
    register,
    login,
    forgetPassword,
    pReset
}