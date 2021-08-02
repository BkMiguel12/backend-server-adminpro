const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { validateFields } = require('../middlewares/fieldsValidator');
const { validateJWT } = require('../middlewares/auth');

const { getDoctors, createDoctor, editDoctor, deleteDoctor } = require('../controllers/doctor.controller');

// Get doctors
router.get('/', [], getDoctors);

// Create doctor
router.post('/', [
    validateJWT,
    check('name', 'EL nombre del doctor es requerido').notEmpty(),
    check('hospital', 'EL ID del hospital debe ser válido').isMongoId(),
    validateFields
], createDoctor);

// Edit doctor
router.put('/:id', [
    validateJWT,
    check('name', 'El nombre del doctor es requerido').notEmpty(),
    check('hospital', 'El ID del hospital debe ser válido').isMongoId(),
    validateFields
], editDoctor);

// Delete doctor
router.delete('/:id', [
    validateJWT
], deleteDoctor);

module.exports = router;
