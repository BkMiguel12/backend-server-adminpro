const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validateJWT } = require('../middlewares/auth');
const { uploadFile } = require('../controllers/upload.controller');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', validateJWT, uploadFile);

module.exports = router;

// function uploadByType(type, id, imageName, res) {
//     if(type === 'users') {
//         User.findById(id, (err, user) => {
            
//             if(err) {
//                 return res.status(500).json({
//                     ok: false,
//                     message: 'Error encontrando el usuario',
//                     errors: err
//                 });
//             }

//             if(!user) {
//                 let actualPath = './uploads/users/' + imageName;
//                 if(fs.existsSync(actualPath)) {
//                     fs.unlinkSync(actualPath);
//                 }

//                 return res.status(400).json({
//                     ok: false,
//                     message: 'No existe usuario',
//                     errors: {message: 'No existe un usuario con el ID: ' + id}
//                 });
//             }

//             const oldPath = './uploads/users/' + user.image;
//             if(fs.existsSync(oldPath)) { // Verify if the user have an image. If its true, delete it
//                 fs.unlinkSync(oldPath);
//             }

//             user.image = imageName;

//             user.save((err, updatedUser) => {
//                 if(err) {
//                     return res.status(400).json({
//                         ok: false,
//                         message: 'Error actualizando el usuario',
//                         errors: err
//                     });
//                 }

//                 updatedUser.password = '';

//                 return res.status(200).json({
//                     ok: true,
//                     message: 'Imagen de usuario actualizada',
//                     user: updatedUser
//                 });
//             });
    
//         });
//     }

//     if(type === 'doctors') {
//         Doctor.findById(id, (err, doctor) => {

//             if(err) {
//                 return res.status(500).json({
//                     ok: false,
//                     message: 'Error encontrando el doctor',
//                     errors: err
//                 });
//             }

//             if(!doctor) {
//                 let actualPath = './uploads/doctors/' + imageName;
//                 if(fs.existsSync(actualPath)) {
//                     fs.unlinkSync(actualPath);
//                 }
                
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'No existe doctror',
//                     errors: {message: 'No existe un doctor con el ID: ' + id}
//                 });
//             }

//             const oldPath = './uploads/doctors/' + doctor.image;
//             if(fs.existsSync(oldPath)) {
//                 fs.unlinkSync(oldPath);
//             }

//             doctor.image = imageName;

//             doctor.save((err, updatedDoctor) => {
//                 if(err) {
//                     return res.status(400).json({
//                         ok: false,
//                         message: 'Error actualizando el doctor',
//                         errors: err
//                     });
//                 }

//                 return res.status(200).json({
//                     ok: true,
//                     message: 'Imagen de doctor actualizada',
//                     doctor: updatedDoctor
//                 });

//             });
//         });

//     }

//     if(type === 'hospitals') {
//         Hospital.findById(id, (err, hospital) => {

//             if(err) {
//                 return res.status(500).json({
//                     ok: false,
//                     message: 'Error encontrando el hospital',
//                     errors: err
//                 });
//             }

//             if(!hospital) {
//                 let actualPath = './uploads/hospitals/' + imageName;
//                 if(fs.existsSync(actualPath)) {
//                     fs.unlinkSync(actualPath);
//                 }
                
//                 return res.status(400).json({
//                     ok: false,
//                     message: 'No existe hospital',
//                     errors: {message: 'No existe un hospital con el ID: ' + id}
//                 });
//             }

//             const oldPath = './uploads/hospitals/' + hospital.image;
//             if(fs.existsSync(oldPath)) {
//                 fs.unlinkSync(oldPath);
//             }

//             hospital.image = imageName;

//             hospital.save((err, updatedHospital) => {
//                 if(err) {
//                     return res.status(500).json({
//                         ok: false,
//                         message: 'Error actualizando hospital',
//                         errors: err
//                     });
//                 }

//                 return res.status(200).json({
//                     ok: true,
//                     message: 'Imagen de hospital actualizada',
//                     hospital: updatedHospital
//                 });
//             });
//         });
//     }
// }