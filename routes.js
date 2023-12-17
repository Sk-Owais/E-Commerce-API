let express = require('express')
let routes = express.Router()
let auth = require('./controller/authController')
let authMid = require('../API Project/middleware/authMiddleware')
let product = require('../API Project/controller/productController')
let cart = require('./controller/cartController')

routes.post('/register', auth.register)
routes.post('/login', auth.login)
routes.post('/forgetPassword', auth.forgetPassword)
routes.post('/reset/:email', auth.pReset)

routes.post('/product/create', authMid.authM('product_create'), product.create)
routes.get('/product', authMid.authM('product_view'), product.viewAll)
routes.post('/product/update/:id', authMid.authM('product_update'), product.update)
routes.delete('/product/delete/:id', authMid.authM('product_delete'), product.pDelete)

routes.post('/cart/:id', authMid.authM('cart_create'), cart.create)
routes.get('/cart', authMid.authM('cart_viewAll'), cart.viewAll)
routes.post('/cart/update/:id', authMid.authM('cart_update'), cart.update)
routes.delete('/cart/:id', authMid.authM('cart_update'), cart.cartDelete)



module.exports = { routes }