const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { validateFields } = require('../middlewares/fieldsValidator');
const { validateJWT } = require('../middlewares/auth');

const { getUsers, postUser, putUser, deleteUser } = require('../controllers/users.controller');

// GET Users
router.get('/', validateJWT, getUsers);

// POST user
router.post('/', [
    validateJWT,
    check('name', 'El campo NOMBRE es requerido').notEmpty(),
    check('password', 'El campo PASSWORD es requerido').notEmpty(),
    check('email', 'El campo EMAIL es requerido').isEmail(),
    validateFields
], postUser);

// PUT user
router.put('/:id', [
    validateJWT,
    check('name', 'El campo NOMBRE es requerido').notEmpty(),
    check('email', 'El campo EMAIL es requerido').isEmail(),
    validateFields
], putUser);

// DELETE user
router.delete('/:id', validateJWT, deleteUser);

module.exports = router;