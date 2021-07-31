const Doctor = require('../models/doctor');

// ===========================================
// ============ GET all doctors ==============
// ===========================================
const getDoctors = async (req, res) => {

    try {
        const doctors = 
            await Doctor.find()
                        .populate('user', 'name image')
                        .populate('hospital', 'name');
        res.json({
            ok: true,
            doctors
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }

    // var from = req.query.from || 0;
    // var total = req.query.total || 5;

    // from = Number(from);
    // total = Number(total);

    // Doctor.find({})
    // .skip(from)
    // .limit(total)
    // .populate('user', 'name email')
    // .populate('hospital', 'name')
    // .exec(
    //     (err, doctors) => {
    //         if(err) {
    //             return res.status(500).json({
    //                 ok: false,
    //                 message: 'Error encontrando los doctores',
    //                 errors: err
    //             });
    //         }

    //         Doctor.countDocuments({}, (err, counter) => {
    //             if(err) {
    //                 return res.status(500).json({
    //                     ok: false,
    //                     message: 'Error en el contador',
    //                     errors: err
    //                 });
    //             }

    //             res.status(200).json({
    //                 ok: true,
    //                 doctors: doctors,
    //                 total: counter
    //             });
    //         });
    //     }
    // );
}

// ===========================================
// ======= POST - Create a new doctor ========
// ===========================================
const createDoctor = async (req, res) => {
    const body = req.body;
    const { uid } = req;

    const doctor = new Doctor({
        user: uid,
        ...body
    });

    try {
        const savedDoctor = await doctor.save();

        res.json({
            ok: true,
            doctor: savedDoctor
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        });
    }
}

// ===========================================
// ========== PUT - Edit a Doctor ============
// ===========================================
const editDoctor = (req, res) => {
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
}

// ===========================================
// ============ DELETE a doctor ==============
// ===========================================
const deleteDoctor = (req, res) => {
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
}

module.exports = {
    getDoctors,
    createDoctor,
    editDoctor,
    deleteDoctor
}