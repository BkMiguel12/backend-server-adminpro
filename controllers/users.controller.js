const bcrypt = require('bcryptjs');
const User = require('../models/user');

// ===========================================
// ============== GET users ==============
// ===========================================
const getUsers = (req, res) => {

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
}

// ===========================================
// ============== POST new user ==============
// ===========================================
const postUser = async (req, res) => {
    var body = req.body;

    const existEmail = await User.findOne({email: body.email});

    if( existEmail ) {
        return res.status(400).json({
            ok: false,
            msg: 'El correo ya existe'
        });
    }

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
}

// ===========================================
// ============== PUT edit user ==============
// ===========================================
const putUser = (req, res) => {
    const id = req.params.id;
    const body = req.body;

    User.findById(id, async (err, user) => {
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

        const { password, google, email, ...fields } = body;

        const updatedUser = await User.findByIdAndUpdate(id, fields, { new: true });

        if(user.email !== email) {
            const emailExists = await User.findOne({ email });
            if(emailExists) {
                res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese correo'
                });
            }
        }

        fields.email = email;

        res.json({
            ok: true,
            user: updatedUser
        });

    });
}

// ===========================================
// ============== DELETE User ================
// ===========================================
const deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const dbUser = await User.findById(id);

        if(!dbUser) {
            res.status(400).json({
                ok: false,
                msg: 'No se ha encontrado ningun usuario'
            })
        }

        await User.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })

    } catch(err) {
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error inesperado!'
        });
    }
}

module.exports = {
    getUsers,
    postUser,
    putUser,
    deleteUser
}