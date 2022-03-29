require('dotenv').config();
require('./db.js') // import mongo db init 
const app = require('./app.js'); // instance of app with express
const productRouter = require('./controllers/products/routesProducts')
const categoryRouter = require('./controllers/category/routesCategories')
const userRouter = require('./controllers/users/routesUsers')
const authRouter = require('./controllers/login/authRoutes')
const PORT = process.env.PORT || 3000;
// Routes exported here.




app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', userRouter)


app.listen(3000)
console.log('Server on port ', 3000);








