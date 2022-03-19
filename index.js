require('dotenv').config();
require('./db.js') // import mongo db init 
const app = require('./app.js'); // instance of app with express
const userRouter = require('./controllers/login/users.js')
const productRouter = require('./controllers/products/routesProducts')
const loginRouter = require('./controllers/login/login.js')
const categoryRouter = require('./controllers/category/routesCategories')

// Routes exported here.




app.use('/api/products', productRouter)
app.use('/api/categories', categoryRouter)
app.use('/api/user/signup', userRouter);
app.use('/api/user/signin', loginRouter);



app.listen(3000)
console.log('Server on port ', 3000);








