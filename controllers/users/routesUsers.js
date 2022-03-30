const userRouter = require('express').Router();
const User = require("../../models/users/User");

const { getUsers, getUsersById, updateUser, deleteUser } = require('../../controllers/users/userFunctions')


// GET || http://localhost:3000/api/users
userRouter.get('/',getUsers)

// GET || http://localhost:3000/api/users/:id
userRouter.get('/:id',getUsersById)

// PUT || http://localhost:3000/api/users/update/:id
userRouter.put('/update/:id',updateUser)

// DELETE || http://localhost:3000/api/users/delete/:id
userRouter.delete('/delete/:id',deleteUser)



module.exports = userRouter;