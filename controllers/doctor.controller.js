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
const editDoctor = async (req, res) => {
    const id = req.params.id;
    const userID = req.uid;
    const body = req.body;

    try {
        const doctor = await Doctor.findById(id);

        if(!doctor) {
            return res.status(404).json({
                ok: false,
                msg: "Doctor no encontrado por ID"
            });
        }

        const changes = {
            ...body,
            user: userID
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(id, changes, { new: true });

        res.json({
            ok: true,
            doctor: updatedDoctor
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }
}

// ===========================================
// ============ DELETE a doctor ==============
// ===========================================
const deleteDoctor = async (req, res) => {
    const id = req.params.id;
    
    try {
        const doctor = await Doctor.findById(id);
    
        if(!doctor) {
            return res.status(404).json({
                ok: false,
                msg: "Doctor no encontrado por ID"
            });
        }

        await Doctor.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "Doctor eliminado!"
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        });
    }
}

module.exports = {
    getDoctors,
    createDoctor,
    editDoctor,
    deleteDoctor
}