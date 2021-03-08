"use strict";
exports.putUpdate = (req, res, next) => {
    //Bisognerebbe anche verificare se esiste un record per l'id
    const id = req.body.id;
    const table = req.body.table;
    const username = req.body.username;
    res.json(username);
};
