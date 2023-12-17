let express = require('express')
let config = require('config')
let port = config.get('port')
let app = express()
let { routes } = require('./routes')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routes)

app.listen(port, () => {
    console.log(`Server is running on ${port}`)
})