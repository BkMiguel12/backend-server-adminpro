const { Router } = require('express');
const router = Router();

const { check } = require('express-validator');
const { validateFields } = require('../middlewares/fieldsValidator');
const { validateJWT } = require('../middlewares/auth');

const { getHospitals, createHospital, editHospital, deleteHospital } = require('../controllers/hospital.controller');

// Get Hospitals
router.get('/', [], getHospitals);

// Create hospital
router.post('/', [], createHospital);

// Edit hospital
router.put('/:id', [], editHospital);

// Delete hospital
router.delete('/:id', [], deleteHospital);

module.exports = router;