"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
let jwt = require('jsonwebtoken');
const fs_1 = __importDefault(require("fs"));
let option = {
    algorithm: "RS256",
    expiresIn: "1h"
};
let getPayload = (token) => {
    let decode = jwt.decode(token, { complete: true });
    return decode.payload;
};
/* let setToken = (username: any, password: any, idutente: any, commessa: any, autorizzazione: any)=>{ */
let setToken = (username, password, idutente, commessa, autorizzazione, idutcas) => {
    let payload = { idutente: idutente, idutcas: idutcas, username: username, commessa: commessa, autorizzazione: autorizzazione };
    let chiaveprivata = fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem');
    let token = jwt.sign(payload, chiaveprivata, option);
    return token;
};
let checkToken = (token) => {
    let chiavePubblica = fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem');
    return jwt.verify(token, chiavePubblica, option);
};
module.exports = {
    setToken,
    getPayload,
    checkToken
};
