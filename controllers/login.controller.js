const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { generateJWT } = require('../helpers/jwt');

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

module.exports = {
    login
}