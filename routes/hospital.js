var express = require('express');

var app = express();

var mdAuth = require('../middlewares/auth');
var Hospital = require('../models/hospital');

// ===========================================
// =========== GET all hospitals =============
// ===========================================
app.get('/', (req, res) => {
    var from = req.query.from || 0;
    var total = req.query.total || 5;

    from = Number(from);
    total = Number(total);

    Hospital.find({})
        .skip(from)
        .limit(total)
        .populate('user', 'name email') 
        .exec(
            (err, hospitals) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error buscando los hospitales',
                        errors: err
                    });
                }

                Hospital.countDocuments({}, (err, counter) => {
                    if(err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error en el contador',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        hospitals: hospitals,
                        total: counter
                    });
                })
            }
        );
});

// ===========================================
// ======= POST - Create new Hospital ========
// ===========================================
app.post('/', mdAuth.verifyToken, (req, res) => {
    var body = req.body;

    var hospital = new Hospital({
        name: body.name,
        image: null,
        user: req.user._id
    });

    hospital.save((err, hospitalSaved) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creando usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalSaved
        });
    });
});

// ===========================================
// ========== PUT - Edit Hospital ============
// ===========================================
app.put('/:id', mdAuth.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if(err) {
             return res.status(500).json({
                ok: false,
                message: 'Error buscando el hospital',
                errors: err
            });
        }

        if(!hospital) {
             return res.status(400).json({
                ok: false,
                message: 'Error encontrando el hospital',
                errors: {message: 'El hospital con el ID: ' + id + ' no existe'}
            });
        }

        hospital.name = body.name;
        hospital.user = req.user._id

        hospital.save((err, updatedHospital) => {
            if(err) {
                 return res.status(500).json({
                    ok: false,
                    message: 'Error buscando el hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: updatedHospital
            });
        })
    })
});

// ===========================================
// =========== DELETE a Hospital =============
// ===========================================
app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, deletedHospital) => {
        if(err) {
            return res.status(500).json({
               ok: false,
               message: 'Error eliminando el hospital',
               errors: err
           });
       }

       if(!deletedHospital) {
            return res.status(400).json({
                ok: false,
                message: 'No existe el usuario!',
                errors: {message: 'El hospital con el ID: ' + id + ' no existe'}
            });
       }

       res.status(200).json({
           ok: true,
           hospital: deletedHospital
       });
    });
});

module.exports = app;