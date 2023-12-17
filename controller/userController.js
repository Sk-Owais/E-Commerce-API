let userModel = require('../model/userModel')

async function create(req, res) {
    let data = await userModel.create(req.body).catch((error) => { return { error } })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error"
        return res.send({ error })
    }
    return res.send({ data })
}

module.exports = {
    create
}