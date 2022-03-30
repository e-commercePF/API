const reviewRouter = require('express').Router();
const Review = require("../../models/users/Review");

const { createReview, getReview } = require('../../controllers/review/reviewFunctions')

// POST || http://localhost:3000/api/review/create
reviewRouter.post('/create', createReview)
// GET || http://localhost:3000/api/review
reviewRouter.get('/',getReview)


module.exports = reviewRouter;