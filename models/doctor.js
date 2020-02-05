var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var dosctorSchema = new Schema({
    name: { type: String, required: [true, 'El campo Nombre es requerido'] },
    image: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: [true, 'El ID del hospital es un campo obligatorio'] },
});

module.exports = mongoose.model('Doctor', dosctorSchema);