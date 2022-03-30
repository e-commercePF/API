const { Schema, model } = require('mongoose');

// This only works in this app... If I create a new schema from Robo 3T could be a problem.

const orderSchema = new Schema(
    {
        userId: {
            type: String, required: true
        },
        products: [
            {
                productId: { type: String},
                quantity: { type: Number, default: 1}
            }
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true},
        orderId: { type: String, required: true},
        status: { type: String, default: 'pending'},
    }
)


const Order = model('Order', orderSchema);

module.exports = Order;