const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/users/User')

userRouter.post('/', async ( req, res)=> {
    const { body } = req;
    const { username, name, password } = body;


    const passwordHash = await bcrypt.hash(password, 10); // we pass the pasword and the complexity it will have the hash. While the number is higher the higher security but high time to process.

    const user = new User ({
        username,
        name,
        passwordHash
    })

    const saveUser = await user.save();

    res.status(201).json(saveUser);
})

module.exports = userRouter;