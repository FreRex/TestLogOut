"use strict";
const db = require('../conf/db');
let getSelect = async (sql) => {
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
    getSelect
};
