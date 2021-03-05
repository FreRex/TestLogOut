"use strict";
const db = require('./conf/db');
const validator = require('validator');
exports.getSelect = (req, res, next) => {
    let table = req.params.table;
    let sql;
    let id;
    let idWh;
    //-------------------------
    //Verifica parametro 'id'
    //-------------------------
    if (typeof (req.params.id) !== 'undefined') {
        id = req.params.id;
        if (table == 'room') {
            idWh = "multistreaming.id = " + id;
        }
        else {
            idWh = "id = " + id;
        }
    }
    else {
        id = '';
    }
    //---------------------
    //Selezione tipo query  
    //---------------------  
    switch (table) {
        case "room":
            sql = 'SELECT multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, utenti.collaudatoreufficio AS collaudatoreufficio, multistreaming.DataInsert AS DataInsert FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio';
            break;
        case "progetti":
            sql = 'SELECT * FROM rappre_prog_gisfo';
            break;
        case "utenti":
            sql = 'SELECT * FROM utenti ';
            break;
    }
    //----------------------------------
    //-------------------
    // Esecuzione query
    //-------------------
    if (!validator.isNumeric(id) || id == 0) {
        if (id == '') {
            //In caso di assenza di parametri si esegue la query 'senza' WHERE
            db.query(sql + " ORDER BY id DESC", (err, rows, fields) => {
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
        //Parametro valido presente => query 'con' WHERE
        db.query(sql + " WHERE " + idWh + " ORDER BY id DESC", (err, rows, fields) => {
            if (err) {
                res.send('Query error: ' + err.sqlMessage);
            }
            else {
                res.json(rows);
            }
        });
    }
};
