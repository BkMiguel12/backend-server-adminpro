const fs = require('fs');

const Hospital = require('../models/hospital');
const Doctor = require('../models/doctor');
const User = require('../models/user');

const deleteImage = (path) => {
    if(fs.existsSync(path)) {
        // Delete old image
        fs.unlinkSync(path);
    }
}

const updateImage = async (type, id, fileName) => {
    let oldPath = '';

    switch (type) {
        case 'users':
            const user = await User.findById(id);

            if(!user) {
                console.log('No existe un usuario con ese ID');
                return false;
            }

            oldPath = `./uploads/users/${user.image}`;
            deleteImage(oldPath);

            user.image = fileName;
            await user.save();
            return true;

        break;

        case 'doctors':
            const doctor = await Doctor.findById(id);

            if(!doctor) {
                console.log('No existe un doctor con ese ID');
                return false;
            }

            oldPath = `./uploads/doctors/${doctor.image}`;
            deleteImage(oldPath);

            doctor.image = fileName;
            await doctor.save();
            return true;
        break;

        case 'hospitals':
            const hospital = await Hospital.findById(id);

            if(!hospital) {
                console.log('No existe un hospital con ese ID');
                return false;
            }

            oldPath = `./uploads/hospitals/${hospital.image}`;
            deleteImage(oldPath);

            hospital.image = fileName;
            await hospital.save();
            return true;
        break;
    }
}

module.exports = {
    updateImage
}