const { Schema, model } = require('mongoose');

// This only works in this app... If I create a new schema from Robo 3T could be a problem.

const productSchema = new Schema(
    {
        sku: String, // like codigo de barra 
        name: String,
        description: String,
        price: Number,
        quantity: Number,
        isOnStock: Boolean,
        img: String,
        category: String
    }
)


const Product = model('Product', productSchema);

module.exports = Product;




// remove __v & _id. Creating an id prop without _id

// productSchema.set('toJSON', {
//     transform: (doc,obj) => {
//         obj.id = obj._id
//         delete obj._id
//         delete obj.__v
//     }
// })
