const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

// ===========================================
// ============== GET users ==============
// ===========================================
const getUsers = async (req, res) => {

    const from = Number(req.query.from) || 0;
    const limit = Number(req.query.total) || 5;

    try {
        const [users, total] = await Promise.all([ // Se usa el promise.all para que empiece a resolver las promesas de manera simultanea
            User.find().skip(from).limit(limit),
            User.countDocuments()
        ]);

        res.json({
            ok: true,
            users,
            total
        })
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: "Ha ocurrido un error inesperado"
        })
    }
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

    user.save(async (err, userSaved) => {
        if(err) {
            return res.status(400).json({
                ok: false,
                message: 'Error creando usuario',
                errors: err
            });
        }

        const token = await generateJWT(userSaved.id);

        res.status(201).json({
            ok: true,
            user: userSaved,
            token
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
            return res.status(400).json({
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
        return res.status(500).json({
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