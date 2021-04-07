"use strict";
exports.test = (req, res, next) => {
    const execuDb = require('../middleware/execuDb');
    const username = 'admin';
    const password = 'Bambini';
    let query = 'SELECT id FROM utenti WHERE username = ' + username + ' AND password = ' + password;
    res.send("wwwwwwwwww");
    //execuDb.getSelect(query);
};
