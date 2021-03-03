const db = require('./conf/db');

db.connect(
  function (err: any) { 
  if (err) { 
      console.log("!!! Cannot connect !!! Error:");      
  }
  else
  {
     console.log("Connection established.");     
     db.query("SELECT multistreaming.id AS id, multistreaming.usermobile AS usermobile, multistreaming.progettoselezionato AS progettoselezionato, utenti.collaudatoreufficio AS collaudatoreufficio, multistreaming.DataInsert AS DataInsert FROM multistreaming INNER JOIN utenti ON utenti.id = multistreaming.collaudatoreufficio ORDER BY multistreaming.id DESC",
      function (err: any, result: any, fields: any) {
       if (err){
        console.log('Errore query');
       }
       else
       {
        module.exports.multistreamingQuery = result;
       }      
      });
      
      db.query("SELECT * FROM rappre_prog_gisfo ORDER BY rappre_prog_gisfo.id DESC",
      function (err: any, result: any, fields: any) {
       if (err){
        console.log('Errore query');
       }
       else
       {
        module.exports.progettiQuery = result;
       }      
      });

    }
  }
);


