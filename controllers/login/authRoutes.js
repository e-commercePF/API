const express = require('express');
const router = express.Router();
const { signup, signin, googlelogin } = require('./authFunctions');

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/googlelogin', googlelogin)

module.exports = router;
