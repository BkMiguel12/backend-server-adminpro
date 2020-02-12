var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var User = require('../models/user');
var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');

var app = express();

app.use(fileUpload());

app.put('/:type/:id', (req, res) => {

    var type = req.params.type;
    var id = req.params.id;

    if(!req.files) {
        return res.status(400).json({
            ok: false,
            message: 'No ha seleccionado ningún archivo',
            errors: {message: 'Debe seleccionar un archivo!'}
        });
    }

    var image = req.files.image;
    var imageType = image.mimetype;

    var cutImgName = image.name.split('.');
    var imageExt = cutImgName[cutImgName.length - 1];

    var validExtensions = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];

    if(validExtensions.indexOf(imageType) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: 'Es un extensión inválida',
            errors: {message: 'Debe adjuntar archivos de extension: ' + validExtensions.join(', ')}
        });
    }

    var validTypes = ['doctors', 'hospitals', 'users'];

    if(validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            message: 'Es una coleccion inválida',
            errors: {message: 'Debe indicar uno de los siguientes tipos: ' + validTypes.join(', ')}
        });
    }

    var imageName = `${id}-${new Date().getMilliseconds()}.${imageExt}`;
    var path = `./uploads/${type}/${imageName}`;

    image.mv(path, err => {
        if(err) {
            return res.status(500).json({
                ok: false,
                message: 'Error moviendo el archivo',
                errors: err
            });
        }

        uploadByType(type, id, imageName, res);

        // res.status(200).json({
        //     ok: true,
        //     message: 'Peticion correcta',
        //     image: imageName
        // });
    });

});

module.exports = app;

function uploadByType(type, id, imageName, res) {
    if(type === 'users') {
        User.findById(id, (err, user) => {
            
            if(err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error encontrando el usuario',
                    errors: err
                });
            }

            if(!user) {
                let actualPath = './uploads/users/' + imageName;
                if(fs.existsSync(actualPath)) {
                    fs.unlinkSync(actualPath);
                }

                return res.status(400).json({
                    ok: false,
                    message: 'No existe usuario',
                    errors: {message: 'No existe un usuario con el ID: ' + id}
                });
            }

            var oldPath = './uploads/users/' + user.image;
            if(fs.existsSync(oldPath)) { // Verify if the user have an image. If its true, delete it
                fs.unlinkSync(oldPath);
            }

            user.image = imageName;

            user.save((err, updatedUser) => {
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error actualizando el usuario',
                        errors: err
                    });
                }

                updatedUser.password = '';

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de usuario actualizada',
                    user: updatedUser
                });
            });
    
        });
    }

    if(type === 'doctors') {
        Doctor.findById(id, (err, doctor) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error encontrando el doctor',
                    errors: err
                });
            }

            if(!doctor) {
                let actualPath = './uploads/doctors/' + imageName;
                if(fs.existsSync(actualPath)) {
                    fs.unlinkSync(actualPath);
                }
                
                return res.status(400).json({
                    ok: false,
                    message: 'No existe doctror',
                    errors: {message: 'No existe un doctor con el ID: ' + id}
                });
            }

            var oldPath = './uploads/doctors/' + doctor.image;
            if(fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            doctor.image = imageName;

            doctor.save((err, updatedDoctor) => {
                if(err) {
                    return res.status(400).json({
                        ok: false,
                        message: 'Error actualizando el doctor',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de doctor actualizada',
                    doctor: updatedDoctor
                });

            });
        });

    }

    if(type === 'hospitals') {
        Hospital.findById(id, (err, hospital) => {

            if(err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error encontrando el hospital',
                    errors: err
                });
            }

            if(!hospital) {
                let actualPath = './uploads/hospitals/' + imageName;
                if(fs.existsSync(actualPath)) {
                    fs.unlinkSync(actualPath);
                }
                
                return res.status(400).json({
                    ok: false,
                    message: 'No existe hospital',
                    errors: {message: 'No existe un hospital con el ID: ' + id}
                });
            }

            var oldPath = './uploads/hospitals/' + hospital.image;
            if(fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }

            hospital.image = imageName;

            hospital.save((err, updatedHospital) => {
                if(err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error actualizando hospital',
                        errors: err
                    });
                }

                return res.status(200).json({
                    ok: true,
                    message: 'Imagen de hospital actualizada',
                    hospital: updatedHospital
                });
            });
        });
    }
}