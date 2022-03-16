const { Schema, model } = require('mongoose')

const stockSchema = new Schema (
    {
    stock: [{
        cant: Number,
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }
        }]
    }
)

const Stock = model('Stock', categorySchema);

module.exports = Stock;