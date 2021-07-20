var { Schema, model } = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var doctorSchema = Schema({
    name: { type: String, required: [true, 'El campo Nombre es requerido'] },
    image: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: [true, 'El ID del usuario es requerido'] },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El ID del hospital es un campo obligatorio'] },
});

doctorSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

doctorSchema.plugin(uniqueValidator, {message: 'El campo {PATH} debe ser único'});

module.exports = model('Doctor', doctorSchema);