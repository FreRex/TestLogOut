"use strict";
exports.CheckDownloadZip = (req, res, next) => {
    const fs = require('fs');
    //-- Determinazione cartella da verificare
    let nameRooms = req.params.folderzip;
    const path = '/var/www/html/glasses/FrontEnd/datasave/' + nameRooms;
    //-- Controllo se cartella: (non-esiste o vuota) => true; se esiste e non è vuota => false
    function isFull(path) {
        try {
            return fs.readdirSync(path).length !== 0;
        }
        catch (error) {
            return false;
        }
    }
    res.send(isFull(path));
};
exports.DownloadZip = (req, res, next) => {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip();
    const fs = require('fs');
    //----------- determinazione path
    const nameFolder = '/var/www/html/glasses/FrontEnd/datasave/';
    let nameRooms = req.params.folderzip;
    console.log(nameRooms);
    console.log('------------------------');
    //-- Creazione cartella compressa
    fs.readdirSync(nameFolder + nameRooms).forEach((file) => {
        zip.addLocalFile(nameFolder + nameRooms + '/' + file);
    });
    // --- Esecuzione download
    const downloadName = `${nameRooms}.zip`;
    const data = zip.toBuffer();
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${downloadName}`);
    res.set('Content-Length', data.length);
    res.send(data);
};
