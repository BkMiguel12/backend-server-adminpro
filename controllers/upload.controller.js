const { v4: uuidv4 } = require('uuid');
const { updateImage } = require('../helpers/update-img');

const uploadFile = (req, res) => {
    const type = req.params.type;
    const id = req.params.id;

    // Check type
    const validTypes = ['users', 'doctors', 'hospitals'];
    if(!validTypes.includes(type)) {
        return res.status(400).json({
            ok: false,
            msg: "El tipo no es valido"
        })
    }

    // Check file
    if(!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: "No hay ningun archivo seleccionado"
        });
    }

    // Process file
    const file = req.files.img;
    const splittedName = file.name.split('.');
    const extension = splittedName[splittedName.length - 1];

    // Check extension
    const validExtensions = ['png', 'jpg', 'jpeg', 'gif'];
    if(!validExtensions.includes(extension)) {
        return res.status(400).json({
            ok: false,
            msg: "La extension no es válida"
        });
    }

    // Generate internal filename
    const fileName = `${uuidv4()}.${extension}`;

    // Path to save the img
    const path = `uploads/${type}/${fileName}`;

    // Move image
    file.mv(path, function(err) {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: "Ha ocurrido un error al mover la imagen"
            })
        }

        // Update DB
        updateImage(type, id, fileName);
    
        res.json({
            ok: true,
            msg: "Archivo subido !",
            fileName
        })
      });
}

module.exports = {
    uploadFile
}