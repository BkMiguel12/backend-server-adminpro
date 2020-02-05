var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

var app = express();

var User = require('../models/user');

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