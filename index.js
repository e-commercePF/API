require('dotenv').config();
require('./db.js') // import mongo db init 
const app = require('./app.js'); // instance of app with express
const userRouter = require('./controllers/users')
const productRouter = require('./controllers/products')
const loginRouter = require('./controllers/login')
const categoryRouter = require('./controllers/categories')

// Routes exported here.
app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/users', userRouter);
app.use('/api/login', loginRouter);



app.listen(3000)
console.log('Server on port ', 3000);








