var jwt = require('jsonwebtoken');
var config = require('../config/config');

// ===========================================
// ============== Verify Token ===============
// ===========================================

exports.verifyToken = function(req, res, next) {
    var token = req.query.token;

    jwt.verify(token, config.SEED, (err, decoded) => {
        if(err) {
            return res.status(401).json({
                ok: false,
                message: 'Token no válido',
                errors: err
            });
        }

        req.user = decoded.user;

        next();
    })
}