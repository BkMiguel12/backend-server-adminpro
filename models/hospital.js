var { Schema, model } = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var hospitalSchema = Schema({
    name: { type: String, required: [true, 'El campo Nombre es requerido'] },
    image: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

hospitalSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    object.uid = _id;
    return object;
});

hospitalSchema.plugin(uniqueValidator, {message: 'El campo {PATH} debe ser único'});

module.exports = model('Hospital', hospitalSchema);