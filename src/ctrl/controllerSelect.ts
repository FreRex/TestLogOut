exports.getSelect = (req: any, res: any, next: any) => {  
    
    const db = require('../conf/db');
    const validator = require('validator');       
    
    // Definizione variabili
    let table = req.params.table;
    let sql;
    let id;
    let collaudatoreufficio;
    let idWh;

    //-------------------------
    //Verifica parametri
    //-------------------------
    //if (typeof(req.params.id) !== 'undefined' && Number.isInteger(id) && (req.params.id)!= 0 && (req.params.id)!='') {
    if (typeof(req.params.id) !== 'undefined' && validator.isNumeric(req.params.id) && (req.params.id)!= 0 && (req.params.id)!='') {
        id = req.params.id;            
    }
    else
    {
        id = '';
    } 
   
    //if (typeof(req.params.collaudatoreufficio) !== 'undefined') {
    if (typeof(req.params.collaudatoreufficio) !== 'undefined' && validator.isNumeric(req.params.collaudatoreufficio) && (req.params.collaudatoreufficio)!= 0 && (req.params.collaudatoreufficio)!='') {
        collaudatoreufficio = req.params.collaudatoreufficio;
    }
    else
    {
        collaudatoreufficio = '';
    }
    
    //---------------------
    //Selezione tipo query  
    //---------------------  
    switch (table) {        
        
        case "room":
            
            sql='SELECT multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, utenti.collaudatoreufficio AS collaudatoreufficio, multistreaming.DataInsert AS DataInsert FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio ';
            
            if(id==''){ 
                if (collaudatoreufficio == '') {
                    sql= sql + 'ORDER BY id DESC';               
                }
                else
                {
                    sql= sql + 'WHERE utenti.id = ' + collaudatoreufficio + ' ORDER BY id DESC'; 
                }     
               //res.send(sql)           
            }
            else
            {
                if (collaudatoreufficio == '') {
                    sql= sql + 'WHERE multistreaming.id = ' + id + ' ORDER BY id DESC';               
                }
                else
                {
                    sql= sql + 'WHERE multistreaming.id = ' + id + ' AND utenti.id = ' + collaudatoreufficio + ' ORDER BY id DESC'; 
                }                
            }  
            
            //res.send(sql)
           
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
    db.query(sql, (err: any, rows: any, fields: any) => {
      if(err){
        res.send('Query error: ' + err.sqlMessage);
       }else{                                       
         res.json(rows);
       }
    });      
   
};