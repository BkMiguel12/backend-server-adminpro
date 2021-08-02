const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { validateFields } = require('../middlewares/fieldsValidator');

const { login, loginGoogle, renewToken } = require('../controllers/login.controller');
const { validateJWT } = require('../middlewares/auth');

// Login
router.post('/', [
    check('email', 'El email es requerido').isEmail(),
    check('password', 'El password es requerido').notEmpty(),
    validateFields
], login);

// Renew Token
router.post('/renew-token', [
    validateJWT
], renewToken);

// Login Google
router.post('/google', [
    check('token', 'El token es requerido').notEmpty(),
    validateFields
], loginGoogle);

module.exports = router;