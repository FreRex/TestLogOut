"use strict";
exports.putUpdate = (req, res, next) => {
    const db = require('../conf/db');
    const validator = require('validator');
    let table = req.params.table;
    let usermobile = req.params.usermobile;
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
    console.log(table);
    console.log(id);
    console.log(usermobile);
    //---------------------
    //Selezione tipo query  
    //---------------------  
    switch (table) {
        case "room":
            sql = 'UPDATE multistreaming ';
            break;
        case "progetti":
            sql = 'UPDATE rappre_prog_gisfo ';
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
        sql = sql + "SET usermobile = '" + usermobile + "' WHERE " + idWh;
        console.log(sql);
        db.query(sql, (err, rows, fields) => {
            if (err) {
                res.send('Query error: ' + err.sqlMessage);
            }
            else {
                console.log(rows);
            }
        });
    }
};
