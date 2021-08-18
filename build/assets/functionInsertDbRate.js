"use strict";
exports.insertRateVideo = (parametroUnico) => {
    const db = require('../conf/db');
    let queryInsert = [];
    let messageErrore = '';
    if (typeof (parametroUnico) !== 'undefined' && parametroUnico !== null && parametroUnico !== '') {
        queryInsert.push(parametroUnico);
        let sql = "INSERT INTO ratevideodata (dati) VALUES (?)";
        esecuzioneQuery(sql);
    }
    else {
        let messageErrore = ('Errore parametro COMMESSA: vuoto, "undefined" o "null"');
        console.log(messageErrore);
    }
    //-----------------------------   
    function esecuzioneQuery(sqlInsert) {
        db.query(sqlInsert, queryInsert, (err, rows, fields) => {
            if (err) {
                console.log('Query error: ' + err.sqlMessage);
            }
            else {
                //console.log(rows);
            }
        });
    }
    //-----------------------------
};
