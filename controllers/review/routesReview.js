const reviewRouter = require('express').Router();
const Review = require("../../models/users/Review");

const { createReview, getReview, getOrder, getOrderId } = require('../../controllers/review/reviewFunctions')

// POST || http://localhost:3000/api/review/create
reviewRouter.post('/create/', createReview)
// GET || http://localhost:3000/api/review
reviewRouter.get('/',getReview)
// GET || http://localhost:3000/api/review/order/:id
reviewRouter.get('/order/:id',getOrderId)

// GET || http://localhost:3000/api/review/order/:id
reviewRouter.get('/order/',getOrder)
module.exports = reviewRouter;