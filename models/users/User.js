const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            max: 64
        },  
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        passwordHash: {
            type: String,
            required: true
        } ,
        role: {
            type: String, // ---> "admin" "guest" "moderator"
            default: "client"
        }
        
    }, // attributes
    { 
        timestamps: true, 
        versionKey: false
    } // definitions
)


const User = model('User', userSchema);

module.exports = User;







// "_id": String, // mongo detects and it don't alow to create a same user
        // "firstNaame": String,
        // "lastName": String,
        // "hashedPassword": String,
        // "address": Object, // { country, street, city, cp}
        // "shippingAddress": Object, // { country, street, city, cp}



// remove __v & _id. Creating an id prop without _id

// productSchema.set('toJSON', {
//     transform: (doc,obj) => {
//         obj.id = obj._id
//         delete obj._id
//         delete obj.__v
//     }
// })


