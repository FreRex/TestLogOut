exports.getSelectTest = (req: any, res: any, next: any) => {  
    
    const db = require('../conf/db');
    const validator = require('validator'); 
    
    let table = req.params.table;
    let sql;
    let id;
    let idWh;

    //-------------------------
    //Verifica parametro 'id'
    //-------------------------
    if (typeof(req.params.id) !== 'undefined') {
        id = req.params.id;
        if(table=='room'){
            idWh = "multistreaming.id = ?";
        }
        else
        {
            idWh = "id = ?";
        }        
    }
    else
    {
        id = '';
    } 

    //---------------------
    //Selezione tipo query  
    //---------------------  
    switch (table) {        
        case "room":          
          sql='SELECT multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, utenti.collaudatoreufficio AS collaudatoreufficio, multistreaming.DataInsert AS DataInsert FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio ORDER BY id DESC'; 
          break;  
        case "utenti":          
          sql='SELECT * FROM utenti ORDER BY id DESC';          
          break;
        case "progetti":
          sql='SELECT rappre_prog_gisfo.id AS id, utenti.collaudatoreufficio, rappre_prog_gisfo.pk_proj AS pk_proj, rappre_prog_gisfo.nome AS nome, rappre_prog_gisfo.nodi_fisici AS nodi_fisici, rappre_prog_gisfo.nodi_ottici AS nodi_ottici, rappre_prog_gisfo.tratte AS tratte, rappre_prog_gisfo.conn_edif_opta AS conn_edif_opta, rappre_prog_gisfo.long_centro_map AS long_centro_map, rappre_prog_gisfo.lat_centro_map AS lat_centro_map, utenti.id FROM `rappre_prog_gisfo` INNER JOIN utenti ON utenti.id = rappre_prog_gisfo.idutente ORDER BY rappre_prog_gisfo.id DESC ';   
          break;
      }      
    //----------------------------------
    
    //-------------------
    // Esecuzione query
    //-------------------
    if(!validator.isNumeric(id) || id == 0){
        if(id==''){
            //In caso di assenza di parametri si esegue la query 'senza' WHERE
            db.query(sql, (err: any, rows: any, fields: any) => {
                if(err){
                    res.send('Query error: ' + err.sqlMessage);
                }else{                    
                    res.json(rows);
                }
            });
        }
        else
        {
            //Parametri non validi (NON numerici o uguali a ZERO)
            res.send('Parameter error: invalid parameters');
        }        
    }else{
        
        //Parametro valido presente => query 'con' WHERE
        db.query(sql + " WHERE " + idWh, [id], (err: any, rows: any, fields: any) => {
            if(err){
                res.send('Query error: ' + err.sqlMessage);
            }else{                
                res.json(rows);
            }
        });
    }
   
};

