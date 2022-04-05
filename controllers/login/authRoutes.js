const express = require('express');
const router = express.Router();
const { signup, signin, googlelogin, activateAccount, forgotPassword, resetPassword, forceResetPassword, newsletter} = require('./authFunctions');
const { authenticateJWT } = require('../login/authFunctions');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/email-activate/:token', activateAccount) 
router.post('/googlelogin', googlelogin)

router.put('/forgot-password', forgotPassword)
router.put('/reset-password', resetPassword)
// GET || http://localhost:3000/api/auth/force-reset-password --> por body { _id: x._id } y por header / config ={ headers: {Authorization: "Bearer" + token} }
router.put('/force-reset-password', authenticateJWT, forceResetPassword)
router.post('/newsletter', newsletter)



module.exports = router;
