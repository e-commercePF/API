const productRouter = require('express').Router();
const Product = require('../../models/products/Product');
const Category = require('../../models/products/Category')
const { createProduct, getProducts, getProductByName, getBrands, getProductsById, updateProduct, deleteProduct, getPaginatedFilters} = require('../../controllers/products/productFunctions')


// POST || http://localhost:3000/api/products/create
productRouter.post('/create', createProduct)

// GET || http://localhost:3000/api/products
productRouter.get('/',getProducts)
// GET || http://localhost:3000/api/products/brands
productRouter.get('/brands', getBrands)

// GET || http://localhost:3000/api/products/:name
productRouter.get('/name/:name', getProductByName)

// GET || http://localhost:3000/api/products/id/:id
productRouter.get('/id/:id', getProductsById)

// PUT || http://localhost:3000/api/products/update/:id
productRouter.put('/update/:id', updateProduct)

// DELETE || http://localhost:3000/api/products/delete/:id
productRouter.delete('/delete/:id', deleteProduct)

// GET || http://localhost:3000/api/products/range
// productRouter.get('/range', filterRange)

// GET || http://localhost:3000/api/products/forPage
productRouter.get('/forPage', getPaginatedFilters)






module.exports = productRouter;


