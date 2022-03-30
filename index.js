require('dotenv').config();
require('./db.js') // import mongo db init 
const app = require('./app.js'); // instance of app with express
const productRouter = require('./controllers/products/routesProducts')
const categoryRouter = require('./controllers/category/routesCategories')
const userRouter = require('./controllers/users/routesUsers')
const authRouter = require('./controllers/login/authRoutes');
const reviewRouter= require('./controllers/review/routesReview')
const PORT = process.env.PORT || 3000;
const authRouter = require('./controllers/login/authRoutes')
// Routes exported here.
const paymentRouter = require('./controllers/payment/stripe')
const orderRouter = require('./controllers/payment/orders')

const PORT = process.env.PORT || 3000;


app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)
app.use('/api/review', reviewRouter)
app.use('/api/payment', paymentRouter)
app.use('/api/orders', orderRouter)


app.listen(3000)
console.log('Server on port ', 3000);








