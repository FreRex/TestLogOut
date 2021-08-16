"use strict";
exports.CheckDownloadZip = (req, res, next) => {
    const fs = require('fs');
    const path = require('path');
    //-- Determinazione cartella da verificare
    let nameRooms = req.params.folderzip;
    const urlzip = __dirname.replace('build/ctrl', 'frontend/datasave/' + nameRooms);
    //-- Controllo se cartella: (non-esiste o vuota) => true; se esiste e non è vuota => false
    function isFull(urlzip) {
        try {
            return fs.readdirSync(urlzip).length !== 0;
        }
        catch (error) {
            return false;
        }
    }
    res.send(isFull(urlzip));
};
exports.DownloadZip = (req, res, next) => {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip();
    const fs = require('fs');
    const path = require('path');
    //----------- determinazione nome cartella     
    let nameRooms = req.params.folderzip;
    //-- Creazione cartella compressa
    const urlzip = __dirname.replace('build/ctrl', 'frontend/datasave/' + nameRooms);
    fs.readdirSync(urlzip).forEach((file) => {
        zip.addLocalFile(urlzip + '/' + file);
    });
    // --- Esecuzione download
    const downloadName = `${nameRooms}.zip`;
    const data = zip.toBuffer();
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', `attachment; filename=${downloadName}`);
    res.set('Content-Length', data.length);
    res.send(data);
};
