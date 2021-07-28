const { Router } = require('express');
const router = Router();
const { validateJWT } = require('../middlewares/auth');

const { globalSearch, collectionSearch } = require('../controllers/search.controller')

// Global search
router.get('/all/:search', validateJWT, globalSearch);

// Especific search by collection
router.get('/collection/:col/:search', validateJWT, collectionSearch);


module.exports = router;