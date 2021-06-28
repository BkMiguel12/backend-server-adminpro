const mongoose = require('mongoose');

// User and Password MongoDB Atlas
// bkmiguel - N7QTQ9Pi5huqNkuv
// Conection to DB

const dbConnection = async () => {
    try {
        await mongoose.connection.openUri(process.env.DB_CONNECTION, {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('DB \x1b[32m%s\x1b[0m', 'ONLINE');
    } catch (error) {
        console.log(error);
        throw new Error('Error al levantar la base de datos');
    }
}

module.exports = {
    dbConnection
}