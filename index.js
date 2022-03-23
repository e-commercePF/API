require('dotenv').config();
require('./db.js') // import mongo db init 
const app = require('./app.js'); // instance of app with express
const productRouter = require('./controllers/products/routesProducts')
const categoryRouter = require('./controllers/category/routesCategories')
const authRouter = require('./controllers/login/authRoutes')
// Routes exported here.




app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/auth', authRouter)



app.listen(3001)
console.log('Server on port ', 3001);








