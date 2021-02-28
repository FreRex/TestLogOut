const db = require('./conf/db');

db.connect(
  function (err: any) { 
  if (err) { 
      console.log("!!! Cannot connect !!! Error:");      
  }
  else
  {
     console.log("Connection established.");     
     db.query("SELECT * FROM multistreaming", function (err: any, result: any, fields: any) {
      if (err){
        console.log('Errore query');
      }
      else
      {
        //.
        module.exports.multistreamingQuery = result;
      }      
    });
  }
});

