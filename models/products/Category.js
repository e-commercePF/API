const { Schema, model } = require('mongoose');


// This only works in this app... If I create a new schema from Robo 3T could be a problem.

const categorySchema = new Schema(
    {
        name: {
            type: String,
            unique: true
        },
        products: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }]
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


const Category = model('Category', categorySchema);

module.exports = Category;