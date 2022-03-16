const { Schema, model } = require('mongoose');

// This only works in this app... If I create a new schema from Robo 3T could be a problem.

const reviewSchema = new Schema(
    {
        description: String,
        rating: Number
    }
)

// remove __v & _id. Creating an id prop without _id

// productSchema.set('toJSON', {
//     transform: (doc,obj) => {
//         obj.id = obj._id
//         delete obj._id
//         delete obj.__v
//     }
// })


const Review = model('Review', reviewSchema);

module.exports = Review;