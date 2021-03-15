"use strict";
// Metodo per modifica ROOM
exports.putUpdateRoom = (req, res, next) => {
    const db = require('../conf/db');
    let sql = '';
    let id;
    //Parametri modificabili
    let usermobile;
    //Controllo parametri    
    if (typeof (req.body.id) !== 'undefined' && req.body.id !== null && typeof (req.body.id) === 'number' && req.body.id !== '') {
        id = req.body.id;
        if (typeof (req.body.usermobile) !== 'undefined' && req.body.usermobile !== null && req.body.usermobile !== '') {
            usermobile = req.body.usermobile;
            //Richiamo funzione per esecuzione query
            esecuzioneQuery(usermobile, id);
        }
        else {
            res.send('Errore: parametro usermobile vuoto, non numero , "undefined" o "null"');
        }
    }
    else {
        res.send('Errore parametro id: vuoto, "undefined" o "null"');
    }
    //-----------------------    
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(usermobile, id) {
        let sql;
        sql = "UPDATE multistreaming SET usermobile = ? WHERE id= ?";
        db.query(sql, [usermobile, id], (err, rows, fields) => {
            if (err) {
                res.send('Query error: ' + err.sqlMessage);
            }
            else {
                res.send(rows);
            }
        });
    }
};
// Metodo per modifica UTENTI
exports.putUpdateUtenti = (req, res, next) => {
    const db = require('../conf/db');
    let sql = '';
    let id;
    //Parametri modificabili
    let collaudatoreufficio;
    let username;
    let password;
    //Controllo parametri e creazione query   
    if (typeof (req.body.id) !== 'undefined' && req.body.id !== null && typeof (req.body.id) === 'number' && req.body.id !== '') {
        id = req.body.id;
        // collaudatoreufficio      
        if (typeof (req.body.collaudatoreufficio) !== 'undefined' && req.body.collaudatoreufficio !== null && req.body.collaudatoreufficio !== '') {
            collaudatoreufficio = req.body.collaudatoreufficio;
            sql = sql + "collaudatoreufficio = '" + collaudatoreufficio + "' ";
        }
        // username
        if (typeof (req.body.username) !== 'undefined' && req.body.username !== null && req.body.username !== '') {
            username = req.body.username;
            if (sql === '') {
                sql = sql + "username = '" + username + "' ";
            }
            else {
                sql = sql + ", username = '" + username + "' ";
            }
        }
        // password
        if (typeof (req.body.password) !== 'undefined' && req.body.password !== null && req.body.password !== '') {
            password = req.body.password;
            if (sql === '') {
                sql = sql + "password = '" + password + "' ";
            }
            else {
                sql = sql + ", password = '" + password + "' ";
            }
        }
        sql = "UPDATE utenti SET " + sql + " WHERE id = " + id;
        esecuzioneQuery(sql);
    }
    else {
        res.send('Errore parametro id: vuoto, non numero , "undefined" o "null"');
    }
    //-----------------------    
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(sqlUpdate) {
        db.query(sqlUpdate, (err, rows, fields) => {
            if (err) {
                res.send('Query error: ' + err.sqlMessage);
            }
            else {
                res.send(rows);
            }
        });
    }
};
// Metodo per modifica PROGETTI
exports.putUpdateProgetti = (req, res, next) => {
    const db = require('../conf/db');
    let sql = '';
    let id;
    //Parametri modificabili
    let idutente;
    let pk_proj;
    let nome;
    let long_centro_map;
    let lat_centro_map;
    //Controllo parametri e creazione query   
    if (typeof (req.body.id) !== 'undefined' && req.body.id !== null && typeof (req.body.id) === 'number' && req.body.id !== '') {
        id = req.body.id;
        // idutente     
        if (typeof (req.body.idutente) !== 'undefined' && req.body.idutente !== null && req.body.idutente !== '') {
            idutente = req.body.idutente;
            sql = sql + "idutente = '" + idutente + "' ";
        }
        // pk_proj
        if (typeof (req.body.pk_proj) !== 'undefined' && req.body.pk_proj !== null && req.body.pk_proj !== '') {
            pk_proj = req.body.pk_proj;
            if (sql === '') {
                sql = sql + "pk_proj = '" + pk_proj + "' ";
            }
            else {
                sql = sql + ", pk_proj = '" + pk_proj + "' ";
            }
        }
        // nome
        if (typeof (req.body.nome) !== 'undefined' && req.body.nome !== null && req.body.nome !== '') {
            nome = req.body.nome;
            if (sql === '') {
                sql = sql + "nome = '" + nome + "' ";
            }
            else {
                sql = sql + ", nome = '" + nome + "' ";
            }
        }
        // long_centro_map
        if (typeof (req.body.long_centro_map) !== 'undefined' && req.body.long_centro_map !== null && req.body.long_centro_map !== '') {
            long_centro_map = req.body.long_centro_map;
            if (sql === '') {
                sql = sql + "long_centro_map = '" + long_centro_map + "' ";
            }
            else {
                sql = sql + ", long_centro_map = '" + long_centro_map + "' ";
            }
        }
        // lat_centro_map
        if (typeof (req.body.lat_centro_map) !== 'undefined' && req.body.lat_centro_map !== null && req.body.lat_centro_map !== '') {
            lat_centro_map = req.body.lat_centro_map;
            if (sql === '') {
                sql = sql + "lat_centro_map= '" + lat_centro_map + "' ";
            }
            else {
                sql = sql + ", lat_centro_map = '" + lat_centro_map + "' ";
            }
        }
        sql = "UPDATE rappre_prog_gisfo SET " + sql + " WHERE id = " + id;
        esecuzioneQuery(sql);
    }
    else {
        res.send('Errore parametro id: vuoto, non numero , "undefined" o "null"');
    }
    //-----------------------    
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(sqlUpdate) {
        db.query(sqlUpdate, (err, rows, fields) => {
            if (err) {
                res.send('Query error: ' + err.sqlMessage);
            }
            else {
                res.send(rows);
            }
        });
    }
};
