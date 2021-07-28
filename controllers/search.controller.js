const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');


// ===========================================
// ========== Search General  ================
// ===========================================
const globalSearch = async (req, res) => {
    const search = req.params.search;
    const regex = new RegExp(search, 'i');

    try{
        const [ users, doctors, hospitals ] = await Promise.all([
            User.find({ name: regex }),
            Doctor.find({ name: regex }),
            Hospital.find({ name: regex })
        ]);
    
        res.json({
            ok: true,
            users,
            doctors,
            hospitals
        });
    } catch(error) {
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }
}


// ===========================================
// ============ Search Specific ==============
// ===========================================
const collectionSearch = async (req, res) => {
    const col = req.params.col;
    const search = req.params.search;
    const regex = new RegExp(search, 'i');
    let data = [];

    try {
        switch (col) {
            case 'users':
                data = await User.find({ name: regex });
                break;
            case 'doctors':
                data = await Doctor.find({ name: regex })
                                   .populate('user', 'name image')
                                   .populate('hospital', 'name image');
                break;
            case 'hospitals':
                data = await Hospital.find({ name: regex })
                                   .populate('user', 'name image');
                break;
        
            default:
                return res.status(400).json({
                    ok: false,
                    msg: 'Colleción invalida, debes escoger entre users, doctors y hospitals'
                })
        }

        res.json({
            ok: true,
            results: data
        });

    } catch(error) {
        return res.stastus(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }
}

module.exports = {
    globalSearch,
    collectionSearch
}