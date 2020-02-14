var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

// Google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(config.CLIENT_ID);

var app = express();

var User = require('../models/user');

// ===========================================
// ============== Google Login ===============
// ===========================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: config.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async (req, res) => {

    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(err => {
            return res.status(403).json({
                ok: false,
                message: 'Token no válido',
                errors: err
            });
        })

    User.findOne({email: googleUser.email}, (err, userDb) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al encontrar usuario',
                errors: err
            });
        }

        if(userDb) {
            if(userDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    message: 'Debe usar la autenticación normal'
                });
            } else {
                userMatch.password = '';
                var token = jwt.sign({user: userDb}, config.SEED, {expiresIn: 14400});

                res.status(200).json({
                    ok: true,
                    message: 'Login correcto !',
                    user: userDb,
                    token: token,
                    id: userDb._id
                });
            }
        } else {
            // The user doenst exist. Create
            var user = new User();

            user.name = googleUser.name;
            user.email = googleUser.email;
            user.image = googleUser.img;
            user.google = googleUser.google;
            user.password = ';)';

            user.save((err, createdUser) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al crear usuario',
                        errors: err
                    });
                }

                var token = jwt.sign({user: createdUser}, config.SEED, {expiresIn: 14400});

                res.status(200).json({
                    ok: true,
                    message: 'Usuario Creado y Login correcto !',
                    user: createdUser,
                    token: token,
                    id: createdUser._id
                });
            });
        }
    });

    // return res.status(200).json({
    //     ok: true,
    //     message: 'Todo ok!',
    //     googleUser: googleUser
    // });
});

// ===========================================
// ============== Normal Login ===============
// ===========================================
app.post('/', (req, res) => {
    var body = req.body;

    User.findOne({email: body.email}, (err, userMatch) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if(!userMatch) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas! - email'
            });
        }

        if(!bcrypt.compareSync(body.password, userMatch.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credenciales incorrectas! - password'
            });
        }

        // Generate token
        userMatch.password = '';
        var token = jwt.sign({user: userMatch}, config.SEED, {expiresIn: 14400});

        res.status(200).json({
            ok: true,
            message: 'Login correcto !',
            user: userMatch,
            token: token,
            id: userMatch._id
        });

    })


});

module.exports = app;