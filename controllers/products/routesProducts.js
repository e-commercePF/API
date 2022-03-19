const productRouter = require('express').Router();
const Product = require('../../models/products/Product');
const Category = require('../../models/products/Category')
const { getProducts,getProductByName, getProductsById, updateProduct, createProduct, deleteProduct } = require('../../controllers/products/productFunctions')

// GET || http://localhost:3000/api/products
productRouter.get('/',getProducts)

// GET || http://localhost:3000/api/products/:name
productRouter.get('/name/:name', getProductByName)

// GET || http://localhost:3000/api/products/:id
productRouter.get('/id/:id', getProductsById)

// POST || http://localhost:3000/api/products/create
productRouter.post('/create', createProduct)

// DELETE || http://localhost:3000/api/products/delete/:id
productRouter.delete('/delete/:id', deleteProduct)

// PUT || http://localhost:3000/api/products/update/:id
productRouter.put('/update/:id', updateProduct)


module.exports = productRouter;


