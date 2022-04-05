const { Schema, model } = require('mongoose');

const newsletterSchema = new Schema(
    {
        _id: String,
        body: String,
        email: Array,
    }
)

const Newsletter = model('Newletter', newsletterSchema);

module.exports = Newsletter;