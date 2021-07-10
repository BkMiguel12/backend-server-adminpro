const { Router } = require('express');
const router = Router();

const mdAuth = require('../middlewares/auth');
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/fieldsValidator');

const { getUsers, postUser, putUser, deleteUser } = require('../controllers/users.controller');

// GET Users
router.get('/', getUsers);

// POST user
router.post('/', [
    check('name', 'El campo NOMBRE es requerido').notEmpty(),
    check('password', 'El campo PASSWORD es requerido').notEmpty(),
    check('email', 'El campo EMAIL es requerido').isEmail(),
    validateFields
], postUser);

// PUT user
router.put('/:id', [
    mdAuth.verifyToken,
    check('name', 'El campo NOMBRE es requerido').notEmpty(),
    check('email', 'El campo EMAIL es requerido').isEmail(),
    validateFields
], putUser);

// DELETE user
router.delete('/:id', mdAuth.verifyToken, deleteUser);

module.exports = router;