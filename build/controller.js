const mysql = require('mysql');
const db = require('./conf/db');

db.connect(
  function (err) { 
  if (err) { 
      console.log("!!! Cannot connect !!! Error:");      
  }
  else
  {
     console.log("Connection established.");     
     db.query("SELECT * FROM multistreaming", function (err, result, fields) {
      if (err){
        console.log('Errore query');
      }
      else
      {
        module.exports.multistreamingQuery = result;
      }      
    });
  }
});

