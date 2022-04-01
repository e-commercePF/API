const express = require('express');
const router = express.Router();
const { signup, signin, googlelogin, activateAccount, forgotPassword, resetPassword} = require('./authFunctions');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/email-activate/:token', activateAccount) 
router.post('/googlelogin', googlelogin)

router.put('/forgot-password', forgotPassword)
router.put('/reset-password', resetPassword)



module.exports = router;
