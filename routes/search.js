var express = require('express')

var app = express()

var Hospital = require('../models/hospital');
var Doctor = require('../models/doctor');
var User = require('../models/user');

// ===========================================
// ========== Search General  ================
// ===========================================
app.get('/all/:search', (req, res) => {
    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    Promise.all([getHospitals(search, regex), getDoctors(search, regex), getUsers(search, regex)])
        .then(results => {
            res.status(200).json({
                ok: true,
                hospitals: results[0],
                doctors: results[1],
                users: results[2]
            });
        }).catch(err => {
            return res.status(500).json({
                ok: false,
                message: 'Error buscando resultados',
                errors: err
            });
        });
});

// ===========================================
// ============ Search Specific ==============
// ===========================================
app.get('/collection/:col/:search', (req, res) => {
    var col = req.params.col;
    var search = req.params.search;
    var regex = new RegExp(search, 'i');

    var promise;

    if(col === 'users') {
        promise = getUsers(search, regex);
    } else if(col === 'hospitals') {
        promise = getHospitals(search, regex);
    } else if(col === 'doctors') {
        promise = getDoctors(search, regex);
    } else {
        return res.status(500).json({
            ok: false,
            message: 'Las coleciones validas son users, hospitals y doctors',
            errors: {message: 'Colecion no valida'}
        });
    }

    promise.then(results => {
        res.status(200).json({
            ok: true,
            [col]: results
        });
    })


});

function getHospitals(search, regex) {
    return new Promise((resolve, reject) => {
        Hospital.find({name: regex}) 
            .populate('user', 'name email role')
            .exec(
                (err, results) => {
                if(err) {
                    reject('Error buscando resultados', err);
                } else {
                    resolve(results);
                }
            });
    });
}

function getDoctors(search, regex) {
    return new Promise((resolve, reject) => {
        Doctor.find({name: regex})
            .populate('user', 'name email role')
            .populate('hospital', 'name')
            .exec(
                (err, results) => {
                if(err) {
                    reject('Error buscando doctores', err);
                } else {
                    resolve(results);
                }
            });
    });
}

function getUsers(search, regex) {
    return new Promise((resolve, reject) => {
        User.find({}, 'name email role')
            .or([{'name': regex}, {'email': regex}])
            .exec((err, results) => {
                if(err) {
                    reject('Error buscando usuarios', err);
                } else {
                    resolve(results);
                }
            });
    });
}

module.exports = app;