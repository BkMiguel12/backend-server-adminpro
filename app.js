// Requires
var express = require('express');
var mongoose = require('mongoose');

// Init vars
var app = express();

// Conection to DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', {useNewUrlParser: true, useUnifiedTopology: true}, (err, res) => {
    if(err) throw err;

    console.log('Database conection: \x1b[32m%s\x1b[0m', 'ONLINE');
})

// Routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Peticion realizada correctamente'
    });
});


// Server listening
app.listen(3000, () => {
    console.log('Server Express on port 3000: \x1b[32m%s\x1b[0m', 'ONLINE');
});