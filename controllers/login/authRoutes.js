const express = require('express');
const router = express.Router();
const { signup, signin, googlelogin, activateAccount } = require('./authFunctions');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/email-activate', activateAccount)
router.post('/googlelogin', googlelogin)

module.exports = router;
