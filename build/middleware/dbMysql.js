"use strict";
exports.checkUserDb_old = async function (usr, psw) {
    console.log(usr);
    console.log(psw);
    //VERIFICA PRESENZA USER E PASS SU DB    
    const db = require('../conf/db');
    //let select: any = "SELECT id FROM utenti WHERE username = ? AND password = ?";
    let select = "SELECT id FROM utenti WHERE username = 'admin' AND password = 'Bambini'";
    let arrayDb = [usr, psw];
    let check;
    await db.query(select, arrayDb, function (err, result, fields) {
        if (result.length > 1) {
            console.log('Credenziali presenti.');
            check = 1;
        }
        else {
            console.log('Credenziali NON presenti o non corrette.');
            check = 0;
        }
        console.log(check);
        return check;
    });
};
exports.checkUserDb = async function (usr, psw) {
    console.log(usr);
    console.log(psw);
    //VERIFICA PRESENZA USER E PASS SU DB
    let checkUser = false;
    do {
        //Verifica se codice casuale è già presente nel db Mysql
        const db = require('../conf/db');
        let selectDb = "SELECT id FROM utenti";
        let arrayDb = [usr, psw];
        //let select: any = "SELECT id FROM utenti WHERE username = 'admin' AND password = 'Bambini'";    
        await db.query(selectDb, arrayDb, function (err, result, fields) {
            if (result.length < 1) {
                console.log('NON PRESENTE');
                checkUser = false;
            }
            else {
                console.log('presente');
                checkUser = true;
            }
        });
        //console.log(checkUser);
    } while (checkUser === true);
    return checkUser;
};
