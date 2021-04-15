"use strict";
exports.sincroDbMysqlMultistreaming = async function (pk_proj, nome, idutente) {
    //SALVATAGGIO DATI IN multistreaming MYSQL
    //Controllo presenza cod=pk_prj in tabella "multistreaming"
    const db = require('../conf/db');
    let SelectMulti = "SELECT cod FROM multistreaming WHERE cod = ?";
    let datiMulti = [pk_proj];
    await db.query(SelectMulti, datiMulti, function (err, result, fields) {
        if (result.length < 1) {
            let usermobile = nome.toLowerCase();
            usermobile = usermobile.replace(/ /g, '');
            let queryInsert = [pk_proj, usermobile, nome, idutente];
            let sqlInsert = "INSERT INTO multistreaming (cod, usermobile, progettoselezionato, collaudatoreufficio) VALUES (?,?,?,?)";
            db.query(sqlInsert, queryInsert);
        }
        else {
            console.log('Room già presente in Collaudolive');
        }
    });
};
