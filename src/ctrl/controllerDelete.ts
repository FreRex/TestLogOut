// Metodo per modifica PROGETTI
exports.delete = (req: any, res: any, next: any) => {   
    const db = require('../conf/db');
    
    let sql: any = '';
    let id: Number;
    let table: any; 
    
    //Controllo parametri e creazione query   
    if(typeof(req.body.id) !== 'undefined' && req.body.id !== null && typeof(req.body.id)==='number' && req.body.id !== ''){
        id = req.body.id; 

        //determina tabella da lavorare e genera query
        if(typeof(req.body.table) !== 'undefined' && req.body.table !== null && req.body.table !== ''){
            table = req.body.table;            
            sql = "DELETE FROM " + table + " WHERE id = " + id;
        }
        
        esecuzioneQuery(sql);

    }
    else
    { res.send('Errore parametro id: vuoto, non numero , "undefined" o "null"');}
    //-----------------------    
    
    //-------------------
    // Esecuzione query
    //-------------------   
    function esecuzioneQuery(sqlDelete: any){        
        
        db.query(sqlDelete, (err: any, rows: any, fields: any) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{           
                res.send(rows);
            }
        });
    }
   
};
