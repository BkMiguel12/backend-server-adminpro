var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var hospitalSchema = new Schema({
    name: { type: String, required: [true, 'El campo nombre es requerido'] },
    image: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Hospital', hospitalSchema);