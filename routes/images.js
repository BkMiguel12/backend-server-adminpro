var express = require('express');

var app = express();

const path = require('path');
const fs = require('fs');

app.get('/:type/:img', (req, res) => {

    var type = req.params.type;
    var img = req.params.img;

    var pathImg = path.resolve(__dirname, `../uploads/${type}/${img}`);

    if(fs.existsSync(pathImg)) {
        res.sendFile(pathImg);
    } else {
        var noImgPath = path.resolve(__dirname, `../assets/no-img.jpg`);
        res.sendFile(noImgPath);
    }
    
});

module.exports = app;