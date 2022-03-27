const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://admin:pass1234@cluster0.ze0ck.mongodb.net/pfecommerce?retryWrites=true&w=majority')
    .then(database => {
        console.log('Database is connected')
    })
    .catch(err => {
        console.log(err);
})