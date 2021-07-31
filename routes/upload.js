const { Router } = require('express');
const expressFileUpload = require('express-fileupload');

const { validateJWT } = require('../middlewares/auth');
const { uploadFile, getImage } = require('../controllers/upload.controller');

const router = Router();

router.use(expressFileUpload());

router.put('/:type/:id', validateJWT, uploadFile);
router.get('/:type/:img', getImage);

module.exports = router;