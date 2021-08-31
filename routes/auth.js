/*
  Rutas de usuarios / Auth
  host + /api/auth
*/

const { Router } = require('express');
const router = Router();
const { registerUser, loginUser, revalidateToken } = require('../controllers/auth');
const { check } = require('express-validator');
const { fieldsValidator } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post(
  '/register',
  [ //Middlewares
    check('name', 'El name es obligarotio').not().isEmpty(),
    check('email', 'El email es obligarotio').isEmail(),
    check('password', 'El password debe ser de minimo de 6 carácteres').isLength({ min: 6 }),
    fieldsValidator
  ],
  registerUser);

router.post(
  '/',
  [ //Middlewares
    check('email', 'El email es obligarotio').isEmail(),
    check('password', 'El pasword debe ser de 6 carácteres').isLength({ min: 6 }),
    fieldsValidator
  ],
  loginUser);


router.get('/renew', validateJWT, revalidateToken);

module.exports = router;