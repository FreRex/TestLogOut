const db_old = require('../conf/db');

let getSelect_old = async (sql: any) => {

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
  getSelect_old
}