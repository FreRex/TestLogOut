"use strict";
exports.alfaNumeCasuale = function (iLen) {
    // SCRIPT PER sincroDb (https://www.collaudolive.com:port/sincrodb/idutnete/pk_proj/codcasuale)
    // Quando si esegue la sincronizzazione dei db gisfo si chiede un codice casuale,
    // per inserirlo nella "rappre_prog_gisfo" al termine dell'operazione.
    let sRnd = '';
    let sChrs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let checkpresenxa = false;
    do {
        //Creazione codice casuale
        for (var i = 0; i < iLen; i++) {
            let randomPoz = Math.floor(Math.random() * sChrs.length);
            sRnd += sChrs.substring(randomPoz, randomPoz + 1);
        }
        //Verifica se codice casuale è già presente nel db Mysql
        const db = require('../conf/db');
        let SelectMysql = 'SELECT * FROM rappre_prog_gisfo WHERE codcasuale = ?';
        let datiMulti = [sRnd];
        db.query(SelectMysql, datiMulti, function (err, result, fields) {
            if (result.length < 1) {
                checkpresenxa = false;
            }
            else {
                checkpresenxa = true;
            }
        });
    } while (checkpresenxa === true);
    return sRnd;
};
