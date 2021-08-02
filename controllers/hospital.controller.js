const Hospital = require('../models/hospital');

// ===========================================
// =========== GET all hospitals =============
// ===========================================
const getHospitals = async (req, res) => {

    try {
        const hospitals = 
            await Hospital.find()
                          .populate('user', 'name image');

        res.json({
            ok: true,
            hospitals
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }
}

// ===========================================
// ======= POST - Create new Hospital ========
// ===========================================
const createHospital = async (req, res) => {
    const body = req.body;
    const { uid } = req;
    
    const hospital = new Hospital({
        user: uid,
        ...body
    });

    try {
        const savedHospital = await hospital.save();

        res.json({
            ok: true,
            hospital: savedHospital
        });

    } catch(err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: "ha ocurrido un error inesperado"
        });
    }
}

// ===========================================
// ========== PUT - Edit Hospital ============
// ===========================================
const editHospital = async (req, res) => {
    const id = req.params.id;
    const userID = req.uid;

    try {
        const hospital = await Hospital.findById(id);

        if(!hospital) {
            return res.status(404).json({
                ok: false,
                msg: "Hospital no encontrado por ID"
            })
        }

        const changes = {
            ...req.body,
            user: userID
        }

        const updatedHospital = await Hospital.findByIdAndUpdate(id, changes, { new: true });

        res.json({
            ok: true,
            hopsital: updatedHospital
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }
}

// ===========================================
// =========== DELETE a Hospital =============
// ===========================================
const deleteHospital = async (req, res) => {
    const id = req.params.id;

    try {

        const hospital = await Hospital.findById(id);

        if(!hospital) {
            return res.status(404).json({
                ok: false,
                msg: "Hospital no encontrado por ID"
            });
        }

        await Hospital.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: "Hospital eliminado"
        })
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }
}

module.exports = {
    getHospitals,
    createHospital,
    editHospital,
    deleteHospital
}