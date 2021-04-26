"use strict";
exports.idCasUtenti = function (iLen) {
    // Da modificare per nascondere user su room
    let sRnd = '';
    let sChrs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let checkpresenxa = false;
    let ii = 0;
    do {
        //Creazione codice casuale
        for (var i = 0; i < iLen; i++) {
            let randomPoz = Math.floor(Math.random() * sChrs.length);
            sRnd += sChrs.substring(randomPoz, randomPoz + 1);
        }
        //Verifica se codice casuale è già presente nel db Mysql
        const db = require('../conf/db');
        let SelectMysql = 'SELECT * FROM rappre_prog_gisfo WHERE codcasuale = ?';
        let datiMulti = ['123'];
        db.query(SelectMysql, datiMulti, function (err, result, fields) {
            if (result.length < 1) {
                checkpresenxa = false;
            }
            else {
                checkpresenxa = true;
            }
        });
        ii = ii + 1;
        console.log(ii);
    } while (checkpresenxa === true);
};
