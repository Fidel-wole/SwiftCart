const {body, validationResult} = require('express-validator');

exports.validateLogin = [

    body('email').isEmail().notEmpty().withMessage('Email is required'),
    body('password').isLength({min: 8}).isAlphanumeric().notEmpty().withMessage('Password required'),

]