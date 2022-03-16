const mongoose = require('mongoose');
const dbUrl = process.env.MONGO_DB_URL;


mongoose.connect(dbUrl)
    .then(database => {
        console.log('Database is connected')
    })
    .catch(err => {
        console.log(err);
})




//Creating new model
// const product = new Product({
//     name: 'Remera Boca Titular',
//     description: 'Remera Boca Titular. Dale booo dale booo',
//     price: 10500,
//     isOnStock: true
// })

// product.save()
//     .then(res => {
//         console.log(res);
//         mongoose.connection.close()
//     })
//     .catch(err => {
//         console.log(err)
//     })


// Finding with no arguments ---> returns all products.
// Product.find({})
//     .then(res => {
//         console.log(res);
//         mongoose.connection.close();
//     })
//     .catch(err => console.log(err))
