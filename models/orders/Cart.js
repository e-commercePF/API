const { Schema, model } = require('mongoose');

// This only works in this app... If I create a new schema from Robo 3T could be a problem.

const cartSchema = new Schema(
    {
        // _id: "the_users_session_id",
        userId: String,
        status: String, // 'active' or delete Cart
     
        quantity: Number,
        total: Number,
        createdAt: Date,
        products: Array // [{productId, quantity}]
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


const Cart = model('Cart', cartSchema);

module.exports = Cart;


// Cart.update({
//     _id: "the_users_session_id", status:'active'
//   }, {
//     $set: { modified_on: ISODate() }, // add a prop modified on.
//     $push: { // push products in the array
//       products: {
//         sku: "111445GB3", quantity: 1, title: "Simsong One mobile phone", price:1000
//       }
//     }
//   });
