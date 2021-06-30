
exports.getCheckGalleria = (req: any, res: any, next: any) => {  
  
  const db = require('../conf/db');
  const validator = require('validator'); 
  
  let sql;
  let idroom;
  if (typeof(req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom)!= 0 && (req.params.idroom)!='') {
    idroom = req.params.idroom;            
  }
  else
  {
    idroom = '';
  } 

  sql = 'SELECT Count(*) AS numeroFoto, CAST(Count(*)/6 AS DECIMAL) AS numeroPagine, (6) AS numeroFotoXPagina FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom
  
  
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

}


exports.downloadSinglePhoto = (req: any, res: any, next: any) => {  

  const db = require('../conf/db');
  const validator = require('validator'); 
  
  let sql;
  let idroom;
  if (typeof(req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom)!= 0 && (req.params.idroom)!='') {
    idroom = req.params.idroom;            
  }
  else
  {
    idroom = '';
  } 

  sql = 'SELECT Count(*) AS numeroFoto, CAST(Count(*)/6 AS DECIMAL) AS numeroPagine, (6) AS numeroFotoXPagina FROM collaudolive INNER JOIN multistreaming ON collaudolive.progettoselezionato = multistreaming.progettoselezionato WHERE multistreaming.id = '+ idroom
  
  
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

}

exports.mappaProgetto = (req: any, res: any, next: any) => {  

  const db = require('../conf/db');
  const validator = require('validator'); 

  if (typeof(req.params.idroom) !== 'undefined' && validator.isNumeric(req.params.idroom) && (req.params.idroom)!= 0 && (req.params.idroom)!='') {
    let idroom = req.params.idroom;      
    let sql: string = "SELECT * FROM rappre_prog_gisfo WHERE id = ?";
    let datiDb: any = [idroom];
    esecuzioneQuery(sql,datiDb);  
  }
  else
  {
    //Parametro usermobile errato
    res.json("Parametro non corretto. (non numero o 'undefined' o uguale a zero o vuoto");
  } 

    
  //-------------------
  // Esecuzione query
  //-------------------
  function esecuzioneQuery(sql: any, datiDb: any){    
    db.query(sql, [datiDb], (err: any, rows: any, fields: any) => {
      if(err || rows.length == 0){
        //Parametro idroom non presente 
        res.json("Parametro errato: idroom non presente");
      }else{                       
        res.json(rows);
      }
    });
  }

}