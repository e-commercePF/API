const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../../models/users/User')

userRouter.post('/', async ( req, res)=> {
    
    const { username, name, password } = req.body; 
    
    /*the body should came from the form of create user, where the form should 
    check all fields to be filled*/ 

    const passwordHash = await bcrypt.hash(password, 10); 
    // we pass the pasword and the complexity it will have the hash. 
    // While the number is high, the higher security but highs times to process.

    const user = new User ({
        username,
        name,
        passwordHash // we create the user with password hashed (we can't save confidential info in db)
    })

    const saveUser = await user.save(); // we save user in db

    res.status(201).json(saveUser);
})

module.exports = userRouter;