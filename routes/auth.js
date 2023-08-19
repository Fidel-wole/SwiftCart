const express = require('express');

const router = express.Router();
const addUser = require('../controllers/auth')
router.get('/', addUser.authPage);
router.post('/signup', addUser.Postsignup);
module.exports = router;