const userRouter = require('express').Router();
const User = require("../../models/users/User");

const { getUsers, getUsersById, updateUser, deleteUser, adminVerify, clientVerify } = require('../../controllers/users/userFunctions')
const { authenticateJWT } = require('../../controllers/login/authFunctions');

// GET || http://localhost:3000/api/users
userRouter.get('/',getUsers)

// GET || http://localhost:3000/api/users/:id
userRouter.get('/:id',getUsersById)

// PUT || http://localhost:3000/api/users/update/:id
userRouter.put('/update/:id',updateUser)

// DELETE || http://localhost:3000/api/users/delete/:id
userRouter.delete('/delete/:id',deleteUser)

userRouter.get('/admin/verify', authenticateJWT, adminVerify)

userRouter.get('/verify', authenticateJWT, clientVerify)



module.exports = userRouter;