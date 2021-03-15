import { userInfo } from "os";

exports.postCreateUtenti = (req: any, res: any, next: any) => {  
    
    const db = require('../conf/db');
    let sql: any = '';

    let collaudatoreufficio: any;
    let username: any;
    let password: any;
    let autorizzazioni: Number;  
      

    //Controllo parametri e creazione query   
    if(typeof(req.body.collaudatoreufficio) !== 'undefined' && req.body.collaudatoreufficio !== null && req.body.collaudatoreufficio !== ''){
        collaudatoreufficio = req.body.collaudatoreufficio;
        if(typeof(req.body.username) !== 'undefined' && req.body.username !== null && req.body.username !== ''){
            username = req.body.username;
            if(typeof(req.body.password) !== 'undefined' && req.body.password !== null && req.body.password !== ''){
                password = req.body.password;
                if(typeof(req.body.autorizzazioni) !== 'undefined' && req.body.autorizzazioni !== null && req.body.autorizzazioni !== '' && typeof(req.body.autorizzazioni) === 'number'){
                    autorizzazioni = req.body.autorizzazioni;
                    sql = "INSERT INTO utenti (collaudatoreufficio, username, password, autorizzazioni) VALUES (?,?,?,?)";
                    esecuzioneQuery(sql);
                }
                else
                { res.send('Errore parametro autorizzazioni: vuoto, non numero , "undefined" o "null"');}            
            }
            else
            { res.send('Errore parametro password: vuoto, "undefined" o "null"');}
        }
        else
        { res.send('Errore parametro username: vuoto, "undefined" o "null"');}    
    }
    else
    { res.send('Errore parametro collaudatoreufficio: vuoto, "undefined" o "null"');}
    //------------------------------------
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(sqlInsert: any){        
        
        db.query(sqlInsert, [collaudatoreufficio,username,password,autorizzazioni], (err: any, rows: any, fields: any) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{           
                res.send(rows);
            }
        });
    }
    //-----------------------------

}

exports.postCreateProgetti = (req: any, res: any, next: any) => {  
    
    const db = require('../conf/db');
    let queryInsert:any = [];    

    let messageErrore: any = '';    
    let key: any;
    let valore: any = '';
   
    for(let attribute in req.body){
        if(attribute=='idutente' || attribute =='pk_proj'){

            if(typeof(req.body[attribute]) !== 'undefined' && req.body[attribute] !== null && req.body[attribute] !== '' && typeof(req.body[attribute]) === 'number'){
                queryInsert.push(req.body[attribute]);               
            }
            else
            { 
               { messageErrore = ('Errore parametro ' + attribute + ': vuoto, "undefined", non "number" o "null"');} 
            }     

        }
        else
        {
            
            if(typeof(req.body[attribute]) !== 'undefined' && req.body[attribute] !== null && req.body[attribute] !== ''){
                queryInsert.push(req.body[attribute]);                
            }
            else
            { 
                { messageErrore = ('Errore parametro ' + attribute + ': vuoto, "undefined" o "null"');} 
            }

        } 
    }

    // Fine ciclo-esame json => operazione da compiere
    if(messageErrore==''){
        
        let sql: any = "INSERT INTO rappre_prog_gisfo (idutente, pk_proj, nome, nodi_fisici, nodi_ottici, tratte, conn_edif_opta, long_centro_map, lat_centro_map) VALUES (?,?,?,?,?,?,?,?,?)";             
       
        esecuzioneQuery(sql);     

    }
    else
    {
       res.send(messageErrore);
    } 

    //-------------------   
    function esecuzioneQuery(sqlInsert: any){        
        
        db.query(sqlInsert, queryInsert, (err: any, rows: any, fields: any) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{           
                res.send(rows);
            }
        });
    }
    //-----------------------------
   
}

exports.postCreateRoom = (req: any, res: any, next: any) => {  

    const db = require('../conf/db');
    let queryInsert:any = [];    

    let messageErrore: any = '';    
    let key: any;
    let valore: any = '';
   
    for(let attribute in req.body){
        
                   
            if(typeof(req.body[attribute]) !== 'undefined' && req.body[attribute] !== null && req.body[attribute] !== ''){                
                queryInsert.push(req.body[attribute]);               
            }
            else
            { 
                { messageErrore = ('Errore parametro ' + attribute + ': vuoto, "undefined" o "null"');} 
            }

    }

    // Fine ciclo-esame json => operazione da compiere
    if(messageErrore==''){
        
        let sql: any = "INSERT INTO multistreaming (usermobile, progettoselezionato) VALUES (?,?)";             
       
        esecuzioneQuery(sql);     

    }
    else
    {
       res.send(messageErrore);
    } 

    //-------------------   
    function esecuzioneQuery(sqlInsert: any){        
        
        db.query(sqlInsert, queryInsert, (err: any, rows: any, fields: any) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{           
                res.send(rows);
            }
        });
    }
    //-----------------------------

}