const {check} = require('express-validator');

module.exports = [

    check('title')
        .notEmpty().withMessage('*Debes ingresar el título'),

    check('rating')
        .notEmpty().withMessage('*Debes ingresar el rating'),        

    check('awards')
        .notEmpty().withMessage('*Debes ingresar premios'),

    check('release_date')
        .notEmpty().withMessage('*Debes ingresar fecha de estreno'),

    check('length')
        .notEmpty().withMessage('*Debes ingresar duración')    

]