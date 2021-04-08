exports.getSelect = (req: any, res: any, next: any) => {  
    
  const db = require('../conf/db');
  const validator = require('validator');  
  
  let sql = req.params.query;

  try {
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
             
  } catch (err) {
    console.log('Problem connection db')
    res.send('Problem connection db')
  }

    
}