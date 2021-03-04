"use strict";
const db = require('./conf/db');
const validator = require('validator');
exports.getRoom = (req, res, next) => {
    //let id = req.params.id; se dovessimo recuperare il parametro id in GEt dall'URL, altrimenti metto solo il codice per effettuare la query
    db.query("SELECT multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, utenti.collaudatoreufficio AS collaudatoreufficio, multistreaming.DataInsert AS DataInsert FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio ORDER BY multistreaming.id DESC", (err, rows, fields) => {
        if (err) {
            res.send('Query error: ' + err.sqlMessage);
        }
        else {
            res.json(rows);
        }
    });
};
exports.getProgetti = (req, res, next) => {
    //let id = req.params.id; se dovessimo recuperare il parametro id in GEt dall'URL, altrimenti metto solo il codice per effettuare la query
    db.query("SELECT * FROM rappre_prog_gisfo", (err, rows, fields) => {
        if (err) {
            res.send('Query error: ' + err.sqlMessage);
        }
        else {
            res.json(rows);
        }
    });
};
exports.getUtenti = (req, res, next) => {
    //Verifica se parametri passati da url sono indefiniti
    let id;
    if (typeof (req.params.id) !== 'undefined') {
        id = req.params.id; //se dovessimo recuperare il parametro id in GEt dall'URL, altrimenti metto solo il codice per effettuare la query
    }
    else {
<<<<<<< HEAD
        console.log("Connection established.");
        db.query("SELECT multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, utenti.collaudatoreufficio AS collaudatoreufficio, multistreaming.DataInsert AS DataInsert FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio ORDER BY multistreaming.id DESC", function (err, result, fields) {
            if (err) {
                console.log('Errore query');
            }
            else {
                exports.multistreamingQuery = result;
            }
        });
        db.query("SELECT * FROM rappre_prog_gisfo ORDER BY rappre_prog_gisfo.id DESC", function (err, result, fields) {
=======
        id = '';
    }
    if (!validator.isNumeric(id) || id == 0) {
        if (id == '') {
            //In caso di assenza di alcun parametro si esegue la query senza WHERE
            db.query("SELECT * FROM utenti ORDER BY id DESC", (err, rows, fields) => {
                if (err) {
                    res.send('Query error: ' + err.sqlMessage);
                }
                else {
                    res.json(rows);
                }
            });
        }
        else {
            //Parametri non validi (NON numerici o uguali a ZERO)
            res.send('Parameter error: invalid parameters');
        }
    }
    else {
        //Parametro valido presente => query con WHERE
        db.query("SELECT * FROM utenti WHERE id= " + id, (err, rows, fields) => {
>>>>>>> FREX
            if (err) {
                res.send('Query error: ' + err.sqlMessage);
            }
            else {
<<<<<<< HEAD
                exports.progettiQuery = result;
            }
        });
        db.query("SELECT * FROM utenti ORDER BY utenti.id DESC", function (err, result, fields) {
            if (err) {
                console.log('Errore query');
            }
            else {
                exports.utenti = result;
=======
                res.json(rows);
>>>>>>> FREX
            }
        });
    }
};
