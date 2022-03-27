const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_DB_URL)
    .then(database => {
        console.log('Database is connected')
    })
    .catch(err => {
        console.log(err);
})