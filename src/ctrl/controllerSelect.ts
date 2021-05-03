exports.getSelect = (req: any, res: any, next: any) => {  
    
    const db = require('../conf/db');
    const validator = require('validator');       
    
    // Definizione variabili
    let table = req.params.table;
    let sql;
    let id;
    let idutcas;
    let idWh;

    //-------------------------
    //Verifica parametri
    //-------------------------
    //if (typeof(req.params.id) !== 'undefined' && Number.isInteger(id) && (req.params.id)!= 0 && (req.params.id)!='') {
    if (typeof(req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom)!= 0 && (req.params.idroom)!='') {
        id = req.params.idroom;            
    }
    else
    {
        id = '';
    } 
   
    //if (typeof(req.params.collaudatoreufficio) !== 'undefined') {
    if (typeof(req.params.idutcas) !== 'undefined' && (req.params.idutcas)!= 0 && (req.params.idutcas)!='') {
        idutcas = req.params.idutcas;
    }
    else
    {
        idutcas = '';
    }
    
    //---------------------
    //Selezione tipo query  
    //---------------------  
    switch (table) {        
        
        case "room":
            
            //sql="SELECT multistreaming.cod AS cod, multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, utenti.collaudatoreufficio AS collaudatoreufficio, multistreaming.DataInsert AS DataInsert FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio ";
            
            sql = 'SELECT multistreaming.cod AS cod, multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, utenti.collaudatoreufficio AS collaudatoreufficio, multistreaming.DataInsert AS DataInsert, commesse.id AS idcommessa, commesse.denominazione AS commessa ';
            sql = sql + ' FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio ';
            sql = sql + ' INNER JOIN commesse ON commesse.id = utenti.idcommessa ';

            if(id==''){ 
                if (idutcas == '') {
                    sql= sql + "ORDER BY id DESC";               
                }
                else
                {
                    sql= sql + "WHERE utenti.idutcas = '" + idutcas + "' ORDER BY id DESC"; 
                }     
               //res.send(sql)           
            }
            else
            {
                if (idutcas == '') {
                    sql= sql + "WHERE multistreaming.id = " + id + " ORDER BY id DESC";               
                }
                else
                {
                    sql= sql + "WHERE multistreaming.id = " + id + " AND utenti.id = " + idutcas + " ORDER BY id DESC"; 
                }                
            }  
            
            //res.send(sql)
           
        break;  

        case "utenti":          
          //sql='SELECT * FROM utenti ORDER BY id DESC';   
          sql='SELECT utenti.id, utenti.idutcas, utenti.DataCreazione, utenti.collaudatoreufficio, utenti.username, utenti.password, utenti.autorizzazioni, utenti.idcommessa AS idcommessa, commesse.denominazione AS commessa ';       
          sql = sql + 'FROM utenti INNER JOIN commesse ON commesse.id = utenti.idcommessa   ORDER BY `id` DESC'; 
        
          break;

        case "progetti":
          //sql='SELECT rappre_prog_gisfo.id AS idprogetto, rappre_prog_gisfo.DataSincro AS datasincro, utenti.collaudatoreufficio, rappre_prog_gisfo.pk_proj AS pk_proj, rappre_prog_gisfo.nome AS nome, rappre_prog_gisfo.nodi_fisici AS nodi_fisici, rappre_prog_gisfo.nodi_ottici AS nodi_ottici, rappre_prog_gisfo.tratte AS tratte, rappre_prog_gisfo.conn_edif_opta AS conn_edif_opta, rappre_prog_gisfo.long_centro_map AS long_centro_map, rappre_prog_gisfo.lat_centro_map AS lat_centro_map, utenti.id AS idutente FROM `rappre_prog_gisfo` INNER JOIN utenti ON utenti.id = rappre_prog_gisfo.idutente ORDER BY rappre_prog_gisfo.id DESC ';   
          sql = 'SELECT rappre_prog_gisfo.id AS idprogetto, rappre_prog_gisfo.DataSincro AS datasincro, utenti.collaudatoreufficio, rappre_prog_gisfo.pk_proj AS pk_proj, rappre_prog_gisfo.nome AS nome, rappre_prog_gisfo.nodi_fisici AS nodi_fisici, rappre_prog_gisfo.nodi_ottici AS nodi_ottici, rappre_prog_gisfo.tratte AS tratte, rappre_prog_gisfo.conn_edif_opta AS conn_edif_opta, rappre_prog_gisfo.long_centro_map AS long_centro_map, rappre_prog_gisfo.lat_centro_map AS lat_centro_map, utenti.id AS idutente, commesse.id AS idcommessa, commesse.denominazione AS commessa';
          sql = sql + ' FROM `rappre_prog_gisfo` INNER JOIN utenti ON utenti.id = rappre_prog_gisfo.idutente INNER JOIN `commesse` ON utenti.idcommessa = commesse.id ORDER BY `idprogetto` DESC';
          break; 
          
        case "commessa":

          sql = 'SELECT id AS idcommessa, denominazione AS commessa FROM commesse ORDER BY id ASC';   

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