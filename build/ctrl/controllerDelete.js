"use strict";
exports.delete = (req, res, next) => {
    const db = require('../conf/db');
    let sql = '';
    let id;
    let tableDelete;
    //Controllo parametri e creazione query   
    if (typeof (req.body.id) !== 'undefined' && req.body.id !== null && typeof (req.body.id) === 'number' && req.body.id !== '') {
        id = req.body.id;
        //determina tabella da lavorare e genera query
        if (typeof (req.body.tableDelete) !== 'undefined' && req.body.tableDelete !== null && req.body.tableDelete !== '') {
            tableDelete = req.body.tableDelete;
            sql = "DELETE FROM " + tableDelete + " WHERE id = ?";
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
        db.query(sqlDelete, [id], (err, rows, fields) => {
            if (err) {
                res.send('Query error: ' + err.sqlMessage);
            }
            else {
                res.send(rows);
            }
        });
    }
};
