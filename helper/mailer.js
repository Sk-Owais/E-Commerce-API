let mailer = require('nodemailer')
function mail(mailoption) {
    return new Promise((res, rej) => {
        let transporter = mailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'oshaikh427@gmail.com',
                pass: 'ouig gdez pfsc yyeh'
            }
        })
        transporter.sendMail(mailoption, (error, info) => {
            if (error) {
                return rej(error)
            }
            return res(`mail is send to ${mailoption.to}`)
        })
    })
}

module.exports = { mail }