const jwt = require('jsonwebtoken');

const generateJWT = ( uid ) => {
    return new Promise((resolve, reject) => {
        const payload = {
            uid
        }
    
        jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '12h'
        }, (err, token) => {
            if(err) {
                console.log('Error >>', err);
                reject('No se pudo generar el JWT');
            } else {
                resolve(token);
            }
        });
    });
}

module.exports = {
    generateJWT
}