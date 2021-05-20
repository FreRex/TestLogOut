"use strict";
exports.checkLogin = (req, res, next) => {
    let pkproject;
    if (!req.body.pkproject) {
        pkproject = 0;
    }
    else {
        pkproject = req.body.pkproject;
    }
    let usr = req.body.usr;
    let pwd = req.body.pwd;
    console.log(usr);
    console.log(pwd);
    console.log(pkproject);
    let select;
    let datiDb;
    const db = require('../conf/db');
    if (pkproject == 0) {
        select = "SELECT id AS idutente, idcommessa AS commessa, autorizzazioni AS autorizzazione, utenti.idutcas AS idutcas FROM utenti WHERE username = ? AND password = ?";
        datiDb = [usr, pwd];
    }
    else {
        select = "SELECT utenti.id AS idutente, utenti.idcommessa AS commessa, utenti.autorizzazioni AS autorizzazione, utenti.username, utenti.password, multistreaming.collaudatoreufficio, multistreaming.cod, utenti.idutcas AS idutcas FROM utenti INNER JOIN multistreaming ON multistreaming.collaudatoreufficio = utenti.id WHERE utenti.username = ? AND utenti.password = ? AND multistreaming.cod = ?";
        datiDb = [usr, pwd, pkproject];
    }
    db.query(select, datiDb, function (err, result, fields) {
        if (result.length >= 1) {
            console.log('Credenziali presenti.');
            const jwt = require('.././middleware/jwt');
            let token = jwt.setToken(usr, pwd, result[0]['idutente'], result[0]['commessa'], result[0]['autorizzazione'], result[0]['idutcas']);
            let payload = jwt.getPayload(token);
            if (pkproject == 0) {
                res.json({
                    token: token
                });
            }
            else {
                res.json({
                    token: token,
                    pkproject: pkproject
                });
            }
        }
        else {
            console.log('Credenziali NON presenti o NON corrette.');
            res.json(false);
        }
    });
};
exports.decodeToken = (req, res, next) => {
    const jwt = require('.././middleware/jwt');
    let token = req.body.token;
    let payload = jwt.getPayload(token);
    res.json({
        token: token,
        payload: payload
    });
};
exports.checkUserMobile = (req, res, next) => {
    const db = require('../conf/db');
    if (typeof (req.body.usermobile) !== 'undefined' && (req.body.usermobile) != 0 && (req.body.usermobile) != '') {
        let usermobile = req.body.usermobile;
        let sql = "SELECT usermobile FROM multistreaming WHERE usermobile = ?";
        let datiDb = [usermobile];
        esecuzioneQuery(sql, datiDb);
    }
    else {
        //Parametro usermobile errato
        res.json(false);
    }
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(sql, datiDb) {
        db.query(sql, [datiDb], (err, rows, fields) => {
            if (err || rows.length == 0) {
                //Parametro usermobile non presente 
                res.json(false);
            }
            else {
                res.json(true);
            }
        });
    }
};
