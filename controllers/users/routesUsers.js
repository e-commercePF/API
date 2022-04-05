
const userRouter = require('express').Router();
const User = require("../../models/users/User");

const { getUsers, getUsersById, updateUser, deleteUser, adminVerify, clientVerify } = require('../../controllers/users/userFunctions')
const {getEmails, suscribe, sendNewsletter, getNewsLetter} = require ("../../controllers/users/NewsletterFunction")
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

/* NEWSLETTER ROUTES  */
// GET || http://localhost:3000/api/users/newsletter/getEmails  --> email's array
userRouter.get('/newsletter/getEmails', getEmails)
// GET || http://localhost:3000/api/users/newsletter/getNewsLetter --> res.data = { title: '', content: '', date: datexd, emails, _id}
userRouter.get('/newsletter/getNewsLetter', getNewsLetter)
// PUT || http://localhost:3000/api/users/suscribe || body = { newsLetter: true || false } && config = { headers: { Authorization: 'Bearer '+ token } }
userRouter.put('/suscribe', authenticateJWT, suscribe)
// POST || http://localhost:3000/api/users/sendNewsletter || body = { title: "", content: "" } 
userRouter.post('/sendNewsletter', sendNewsletter)



// POST || http://localhost:3000/api/users/send-email
// userRouter.post("/send-email",sendMail)



module.exports = userRouter;

