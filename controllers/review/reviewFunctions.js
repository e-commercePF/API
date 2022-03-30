const Review = require("../../models/users/Review");

const createReview= async(req, res)=>{
    const review = req.body 
    if(!review){
        return res.status(400).json({message: `We could't process your require`})
    } 
    const newReview= await new Review(review)
    newReview.save()
    res.json(newReview)

}

const getReview= async (req, res)=>{
   const reviewsResult= await Review.find({})
   res.json(reviewsResult)
}
module.exports={
    createReview,
    getReview
}
