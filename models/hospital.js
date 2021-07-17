var { Schema, model } = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var hospitalSchema = Schema({
    name: { type: String, required: [true, 'El campo Nombre es requerido'] },
    image: { type: String, required: false },
    user: { required: true , type: Schema.Types.ObjectId, ref: 'User'}
});

hospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

hospitalSchema.plugin(uniqueValidator, {message: 'El campo {PATH} debe ser único'});

module.exports = model('Hospital', hospitalSchema);