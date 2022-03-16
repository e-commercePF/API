const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            required: true,
            type: String,
            unique: true
        },
        name: {
            required: true,
            type: String
        },  
        passwordHash: {
            required: true,
            type: String
        } ,
        role: {
            type: String // ---> "admin" "guest" "moderator"
        }
        
    }
)

userSchema.set('toJSON', {
    transform: (doc, obj) => {
        obj.id = obj._id

        delete obj._id
        delete obj.__v

        delete obj.passwordHash
    }
})


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


