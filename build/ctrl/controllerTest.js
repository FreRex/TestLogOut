"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = (req, res, next) => {
    let username = req.params.username;
    res.send(username);
};
