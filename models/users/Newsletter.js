const { Schema, model } = require('mongoose');

const newsletterSchema = new Schema(
    {
        title:{
            type: String, 
            required: true
        },
        content:{
            type: String, 
            required: true
        },
        email: Array,
        date: Date,
    }
)

const Newsletter = model('Newletter', newsletterSchema);

module.exports = Newsletter;