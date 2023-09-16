const express = require('express');

const router = express.Router();
const auth = require('../controllers/auth');

router.get('/', auth.login);
router.post('/login', auth.postLogin);

router.post('/signup', auth.Postsignup);

router.get('/signup', auth.authPage);

router.get('/reset', auth.getResetPassword);
router.post('/reset', auth.postResetPassword);

module.exports = router;