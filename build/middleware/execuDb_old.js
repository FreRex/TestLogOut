"use strict";
const db_old = require('../conf/db');
let getSelect_old = async (sql) => {
    await db.query(sql, (err, rows, fields) => {
        if (err) {
            console.log('Query error: ' + err.sqlMessage);
        }
        else {
            console.log(rows);
            return rows;
        }
    });
};
module.exports = {
    getSelect_old
};
