exports.putUpdateRoom = (req: any, res: any, next: any) => {   
    const db = require('../conf/db');
    let usermobile;
    let id;  

    //Controllo parametri    
    if(typeof(req.body.id) !== 'undefined' && req.body.id !== null && typeof(req.body.id)==='number' && req.body.id !== ''){
        id = req.body.id;       
        if(typeof(req.body.usermobile) !== 'undefined' && req.body.usermobile !== null && req.body.usermobile !== ''){
            usermobile = req.body.usermobile;
            //Richiamo funzione per esecuzione query
            esecuzioneQuery(usermobile,id);
        }
        else
        { res.send('Errore: parametro id vuoto, non numero , "undefined" o "null"'); }
    }
    else
    { res.send('Errore: parametro table vuoto, "undefined" o "null"');}
    //-----------------------    
    
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(usermobile: any, id: Number){
        let sql;
        sql="UPDATE multistreaming SET usermobile = '" + usermobile + "' WHERE id=" +id;
        db.query(sql, (err: any, rows: any, fields: any) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{           
                res.send(rows);
            }
        });
    }
   
};


exports.putUpdateUtenti = (req: any, res: any, next: any) => {   
    const db = require('../conf/db');
    let id: Number;   
    let collaudatoreufficio: any;
    let username: any;
    let password: any;
    let sql: any = '';       

    //Controllo parametri e creazione query   
    if(typeof(req.body.id) !== 'undefined' && req.body.id !== null && typeof(req.body.id)==='number' && req.body.id !== ''){
        id = req.body.id;       
        if(typeof(req.body.collaudatoreufficio) !== 'undefined' && req.body.collaudatoreufficio !== null && req.body.collaudatoreufficio !== ''){
            collaudatoreufficio = req.body.collaudatoreufficio;
            sql = sql + "collaudatoreufficio = '" + collaudatoreufficio + "' ";
        }
        if(typeof(req.body.username) !== 'undefined' && req.body.username !== null && req.body.username !== ''){
            username = req.body.username;
            if(sql===''){
                sql = sql + "username = '" + username + "' ";
            }
            else
            {
                sql = sql + ", username = '" + username + "' "; 
            }
        }
        if(typeof(req.body.password) !== 'undefined' && req.body.password !== null && req.body.password !== ''){
            password = req.body.password;
            if(sql===''){
                sql = sql + "password = '" + password + "' ";
            }
            else
             {
                sql = sql + ", password = '" + password + "' ";
             }
        }
       
        sql = "UPDATE utenti SET " + sql + " WHERE id = " + id;
        
        esecuzioneQuery(sql);

    }
    else
    { res.send('Errore: parametro id vuoto, non numero , "undefined" o "null"');}
    //-----------------------    
    
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(sqlUpdate: any){        
        
        db.query(sqlUpdate, (err: any, rows: any, fields: any) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{           
                res.send(rows);
            }
        });
    }
   
};