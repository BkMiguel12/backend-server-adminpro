var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

var userSchema = new Schema({
    name: { type: String, required: [true, 'El campo Nombre es requerido'] },
    email: { type: String, unique: true, required: [true, 'El campo Correo es requerido'] },
    password: { type: String, required: [true, 'El campo Contraseña es requerido'] },
    image: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },
    google: { type: Boolean, default: false }
});

userSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

userSchema.plugin(uniqueValidator, {message: 'El campo {PATH} debe ser único'});

module.exports = mongoose.model('User', userSchema);