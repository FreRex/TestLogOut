"use strict";
exports.checkLogin = (req, res, next) => {
    /*
    let pkproject: number;
    if(!req.params.pkproject){
      pkproject=0;
    }
    else
    {
      pkproject = req.params.pkproject;
    }

    console.log(pkproject)

    let usr = req.params.usr;
    let pwd = req.params.pwd;
    */
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
        select = "SELECT id FROM utenti WHERE username = ? AND password = ?";
        datiDb = [usr, pwd];
    }
    else {
        select = "SELECT utenti.id, utenti.username, utenti.password, multistreaming.collaudatoreufficio, multistreaming.cod FROM utenti INNER JOIN multistreaming ON multistreaming.collaudatoreufficio = utenti.id WHERE utenti.username = ? AND utenti.password = ? AND multistreaming.cod = ?";
        datiDb = [usr, pwd, pkproject];
    }
    db.query(select, datiDb, function (err, result, fields) {
        if (result.length >= 1) {
            console.log('Credenziali presenti.');
            const jwt = require('.././middleware/jwt');
            let token = jwt.setToken(usr, pwd);
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
