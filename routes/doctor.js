var express = require('express');

var app = express();

var Doctor = require('../models/doctor');
var mdAuth = require('../middlewares/auth');

// ===========================================
// ============ GET all doctors ==============
// ===========================================
app.get('/', (req, res) => {

    var from = req.query.from || 0;
    var total = req.query.total || 5;

    from = Number(from);
    total = Number(total);

    Doctor.find({})
    .skip(from)
    .limit(total)
    .populate('user', 'name email')
    .populate('hospital', 'name')
    .exec(
        (err, doctors) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error encontrando los doctores',
                    errors: err
                });
            }

            Doctor.countDocuments({}, (err, counter) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error en el contador',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    doctors: doctors,
                    total: counter
                });
            });
        }
    );
});

// ===========================================
// ======= POST - Create a new doctor ========
// ===========================================
app.post('/', mdAuth.verifyToken, (req, res) => {
    var body = req.body;

    var doctor = new Doctor({
        name: body.name,
        image: null,
        user: req.user._id,
        hospital: body.hospital
    });

    doctor.save((err, savedDoctor) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                message: 'Error encontrando los hospitales',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            doctor: savedDoctor
        });
    })
});

// ===========================================
// ========== PUT - Edit a Doctor ============
// ===========================================
app.put('/:id', mdAuth.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Doctor.findById(id, (err, doctor) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error encontrando el doctor',
                errors: err
            });
        }

        if(!doctor) {
            return res.status(400).json({
                ok: false,
                message: 'Error encontrando el doctor',
                errors: {message: 'El doctor con el ID: ' + id + ' no existe'}
            });
        }

        doctor.name = body.name;
        doctor.user = req.user._id;
        doctor.hospital = body.hospital;

        doctor.save((err, updatedDoctor) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error actualizando el doctor',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                doctor: updatedDoctor
            });
        });

    });
});

// ===========================================
// ============ DELETE a doctor ==============
// ===========================================
app.delete('/:id', mdAuth.verifyToken, (req, res) => {
    var id = req.params.id;

    Doctor.findByIdAndRemove(id, (err, deletedDoctor) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error borrando doctor',
                errors: err
            });
        }

        if(!deletedDoctor) {
            return res.status(400).json({
                ok: false,
                message: 'Error encontrando el doctor',
                errors: {message: 'El doctor con el ID: ' + id + ' no existe'}
            });
        }

        res.status(200).json({
            ok: true,
            doctor: deletedDoctor
        });
    });
});

module.exports = app;
