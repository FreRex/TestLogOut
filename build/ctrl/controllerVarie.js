"use strict";
exports.getCheckGalleria = (req, res, next) => {
    const db = require('../conf/db');
    const validator = require('validator');
    let sql;
    let idroom;
    if (typeof (req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom) != 0 && (req.params.idroom) != '') {
        idroom = req.params.idroom;
    }
    else {
        idroom = '';
    }
    sql = 'SELECT Count(*) AS numeroFoto, CAST(Count(*)/6 AS DECIMAL) AS numeroPagine, (6) AS numeroFotoXPagina FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = ' + idroom;
    //-------------------
    // Esecuzione query
    //-------------------
    db.query(sql, (err, rows, fields) => {
        if (err) {
            res.send('Query error: ' + err.sqlMessage);
        }
        else {
            res.json(rows);
        }
    });
};
exports.downloadSinglePhoto = (req, res, next) => {
    const db = require('../conf/db');
    const validator = require('validator');
    let sql;
    let idroom;
    if (typeof (req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom) != 0 && (req.params.idroom) != '') {
        idroom = req.params.idroom;
    }
    else {
        idroom = '';
    }
    sql = 'SELECT Count(*) AS numeroFoto, CAST(Count(*)/6 AS DECIMAL) AS numeroPagine, (6) AS numeroFotoXPagina FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = ' + idroom;
    //-------------------
    // Esecuzione query
    //-------------------
    db.query(sql, (err, rows, fields) => {
        if (err) {
            res.send('Query error: ' + err.sqlMessage);
        }
        else {
            res.json(rows);
        }
    });
};
exports.mappaProgetto = (req, res, next) => {
    const db = require('../conf/db');
    const validator = require('validator');
    if (typeof (req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom) != 0 && (req.params.idroom) != '') {
        let idroom = req.params.idroom;
        let sql = "SELECT * FROM rappre_prog_gisfo WHERE id = ?";
        let datiDb = [idroom];
        esecuzioneQuery(sql, datiDb);
    }
    else {
        //Parametro usermobile errato
        res.json("Parametro non corretto. (non numero o 'undefined' o uguale a zero o vuoto");
    }
    //-------------------
    // Esecuzione query
    //-------------------
    function esecuzioneQuery(sql, datiDb) {
        db.query(sql, [datiDb], (err, rows, fields) => {
            if (err || rows.length == 0) {
                //Parametro idroom non presente 
                res.json("Parametro errato: idroom non presente");
            }
            else {
                res.json(rows);
            }
        });
    }
};
