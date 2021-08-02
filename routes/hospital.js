const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { validateFields } = require('../middlewares/fieldsValidator');
const { validateJWT } = require('../middlewares/auth');

const { getHospitals, createHospital, editHospital, deleteHospital } = require('../controllers/hospital.controller');

// Get Hospitals
router.get('/', [], getHospitals);

// Create hospital
router.post('/', [
    validateJWT,
    check('name', 'El nombre del hospital es requerido').notEmpty(),
    validateFields
], createHospital);

// Edit hospital
router.put('/:id', [
    validateJWT,
    check('name', 'El nombre del hospital es requerido').notEmpty(),
    validateFields
], editHospital);

// Delete hospital
router.delete('/:id', [
    validateJWT,
], deleteHospital);

module.exports = router;