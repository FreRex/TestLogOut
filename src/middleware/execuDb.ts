const db = require('../conf/db');

let getSelect = async (sql: any) => {

  await db.query(sql, (err: any, rows: any, fields: any) => {
    if(err){
        console.log('Query error: ' + err.sqlMessage);
    }else{ 
      console.log(rows);     
      return rows;
    }
  });

}

module.exports = {
  getSelect
}