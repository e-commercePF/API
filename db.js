const mongoose = require('mongoose');
const urlDb = process.env.MONGO_DB_URL

mongoose.connect(urlDb, { useNewUrlParser: true })
    .then(database => {
        console.log('Database is connected')
    })
    .catch(err => {
        console.log(err);
})