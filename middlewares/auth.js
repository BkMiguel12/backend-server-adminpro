var jwt = require('jsonwebtoken');
var config = require('../config/config');

// ===========================================
// ============== Verify Token ===============
// ===========================================

const validateJWT = (req, res, next) => {
    const token = req.header('x-token');

    if(!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No existe token'
        });
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;
        next();

    } catch(err) {
        console.log(err);
        return res.status(401).json({
            ok: false,
            msg: 'El token no es válido'
        });
    }
}


module.exports = {
    validateJWT
}