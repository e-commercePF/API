
const userRouter = require('express').Router();
const User = require("../../models/users/User");

const { getUsers, getUsersById, updateUser, deleteUser, adminVerify, clientVerify } = require('../../controllers/users/userFunctions')
const {getEmails, suscribe} = require ("../../controllers/users/NewsletterFunction")
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

userRouter.get('/newsletter/emails', getEmails)

userRouter.put('/suscribe', suscribe)


// POST || http://localhost:3000/api/users/send-email
// userRouter.post("/send-email",sendMail)



module.exports = userRouter;

