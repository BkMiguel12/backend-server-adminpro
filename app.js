// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Init vars
var app = express();

// Body Parser config
// parse application/x-www-form-urlencoded & application/json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Import Routes
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var loginRoutes = require('./routes/login');

// Conection to DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
}, (err, res) => {
    if(err) throw err;

    console.log('Database conection: \x1b[32m%s\x1b[0m', 'ONLINE');
})

// Routes
app.use('/users', userRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);

// Server listening
app.listen(3000, () => {
    console.log('Server Express on port 3000: \x1b[32m%s\x1b[0m', 'ONLINE');
});