const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/verify-google');

// ===========================================
// ============== Normal Login ===============
// ===========================================
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
         // Verify email
        const dbUser = await User.findOne({email});
        if(!dbUser) {
            return res.status(400).json({
                ok: false,
                msg: 'Email o password no válido - e'
            });
        }

        // Verify Password
        const validPassword = bcrypt.compareSync(password, dbUser.password);
        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Email o password no válido - c'
            });
        }

        // Generate token
        const token = await generateJWT(dbUser.id);

        res.json({
            ok: true,
            msg: 'Login satisfactorio',
            user: dbUser,
            token
        });
    } catch(err){
        console.log(err);
        res.status(500).json({
            ok: false,
            msg: 'Ha ocurrido un error en el servidor'
        });
    }
}

const loginGoogle = async (req, res) => {
    const googleToken = req.body.token;

    try {
        const { name, email, picture } = await googleVerify(googleToken);

        const dbUser = await User.findOne({ email });
        let user;

        if( !dbUser ) {
            // No existe
            user = new User({
                name,
                email,
                password: 'xxxxx',
                image: picture,
                google: true
            });
        } else {
            // Existe
            user = dbUser;
            user.google = true;
        }

        // Save user
        await user.save();

        // Generate token
        const token = await generateJWT(user.id);

        res.json({
            ok: true,
            msg: 'Todo bien google login',
            token,
            user
        });
    } catch (err) {
        console.log(err);
        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        })
    }
}

const renewToken = async (req, res) => {

    const uid = req.uid;
    const token = await generateJWT(uid);
    
    res.json({
        ok: true,
        token
    });
    
}

module.exports = {
    login,
    loginGoogle,
    renewToken
}