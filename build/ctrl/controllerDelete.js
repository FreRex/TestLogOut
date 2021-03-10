"use strict";
// Metodo per modifica PROGETTI
exports.delete = (req, res, next) => {
    const db = require('../conf/db');
    let sql = '';
    let id;
    let table;
    //Controllo parametri e creazione query   
    if (typeof (req.body.id) !== 'undefined' && req.body.id !== null && typeof (req.body.id) === 'number' && req.body.id !== '') {
        id = req.body.id;
        //determina tabella da lavorare e genera query
        if (typeof (req.body.table) !== 'undefined' && req.body.table !== null && req.body.table !== '') {
            table = req.body.table;
            sql = "DELETE FROM " + table + " WHERE id = " + id;
        }
        esecuzioneQuery(sql);
    }
    else {
        res.send('Errore parametro id: vuoto, non numero , "undefined" o "null"');
    }
    //-----------------------    
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(sqlDelete) {
        db.query(sqlDelete, (err, rows, fields) => {
            if (err) {
                res.send('Query error: ' + err.sqlMessage);
            }
            else {
                res.send(rows);
            }
        });
    }
};
