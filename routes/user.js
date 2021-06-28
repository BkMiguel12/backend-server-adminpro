var express = require('express');
var bcrypt = require('bcryptjs');

var mdAuth = require('../middlewares/auth');

var app = express();

var User = require('../models/user');

// ===========================================
// ============== GET all users ==============
// ===========================================
app.get('/', (req, res, next) => {

    var from = req.query.from || 0;
    var total = req.query.total || 5;

    from = Number(from);
    total = Number(total);

    User.find({}, 'name email image role')
        .skip(from)
        .limit(total)
        .exec(
            (err, users) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error loading users',
                        errors: err
                    });
                }

                User.countDocuments({}, (err, counter) => {
                    if(err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error en el contador',
                            errors: err
                        });
                    }

                    res.status(200).json({
                        ok: true,
                        users: users,
                        total: counter
                    });
                });
            }
        );
});

// ===========================================
// ============== POST new user ==============
// ===========================================
app.post('/', (req, res) => {
    var body = req.body;

    var user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        image: body.image,
        role: body.role
    });

    user.save((err, userSaved) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creando usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            user: userSaved ,
            userToken: req.user
        });
    });
});

// ===========================================
// ============== PUT edit user ==============
// ===========================================
app.put('/:id', mdAuth.verifyToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    User.findById(id, (err, user) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error encontrando usuario!',
                errors: err
            });
        }

        if(!user) {
            return res.status(400).json({
                ok: false,
                message: 'Error encontrando usuario',
                errors: {message: 'El usuario con el ID: ' + id + ' no existe'}
            });
        }

        user.name = body.name;
        user.email = body.email;
        user.role = body.role;

        user.save((err, userSaved) => {
            if(err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error actualizando usuario!',
                    errors: err
                });
            }

            userSaved.password = '';

            res.status(200).json({
                ok: true,
                user: userSaved
            });
        });
    });
});

// ===========================================
// ============== DELETE User ================
// ===========================================
app.delete('/:id', mdAuth.verifyToken, (req, res) => {
    var id = req.params.id;

    User.findByIdAndRemove(id, (err, userDeleted) => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error borrando usuario',
                errors: err
            });
        }

        if(!userDeleted) {
            return res.status(400).json({
                ok: false,
                message: 'No existe el usuario',
                errors: {message: 'El usuario con el ID: ' + id + ' no existe'}
            });
        }

        res.status(200).json({
            ok: true,
            user: userDeleted
        });
    })
});

module.exports = app;