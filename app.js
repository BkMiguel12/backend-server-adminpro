// Requires
require('dotenv').config();

const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');

// Init vars
const app = express();

// DB Connection
dbConnection();

// Body Parser config
// parse application/x-www-form-urlencoded & application/json
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// CORS
app.use(cors());

// Public Directory
app.use(express.static('public'))

// Import Routes
const appRoutes = require('./routes/app');
const userRoutes = require('./routes/user');
const loginRoutes = require('./routes/login');
const hospitalRoutes = require('./routes/hospital');
const doctorRoutes = require('./routes/doctor');
const searchRoutes = require('./routes/search');
const uploadRoutes = require('./routes/upload');
const imagesRoutes = require('./routes/images');


// Routes
app.use('/users', userRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/doctor', doctorRoutes);
app.use('/search', searchRoutes);
app.use('/upload', uploadRoutes);
app.use('/login', loginRoutes);
app.use('/img', imagesRoutes);
app.use('/', appRoutes);

// Server listening
app.listen(process.env.PORT, () => {
    console.log(`Server Express on port: ${process.env.PORT} \x1b[32m%s\x1b[0m`, 'ONLINE');
});