const productRouter = require('express').Router();
const Product = require('../../models/products/Product');
const Category = require('../../models/products/Category')
const { getProducts,getProductByName,  getProductsById, updateProduct, createProduct, deleteProduct, sortPriceDesc, sortPriceAsc, sortNameAsc, sortNameDesc, filterByCategory} = require('../../controllers/products/productFunctions')

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

// GET || http://localhost:3000/api/products/desc
productRouter.get('/desc', sortPriceDesc)

// GET || http://localhost:3000/api/products/asc
productRouter.get('/asc', sortPriceAsc)

// GET || http://localhost:3000/api/products/nameA
productRouter.get('/nameA', sortNameAsc)

// GET || http://localhost:3000/api/products/nameZ
productRouter.get('/nameZ', sortNameDesc)

// GET || http://localhost:3000/api/products/category
productRouter.get('/category', filterByCategory)


module.exports = productRouter;


