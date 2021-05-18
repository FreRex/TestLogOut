let jwt = require('jsonwebtoken');
import fs from 'fs';

let option = {
    algorithm: "RS256",
    expiresIn: "1h"
}

let getPayload = (token: any) => {
    let decode = jwt.decode(token, {complete: true});
    return decode.payload;
}

/* let setToken = (username: any, password: any, idutente: any, commessa: any, autorizzazione: any)=>{ */
let setToken = (username: any, password: any, idutente: any, commessa: any, autorizzazione: any)=>{
    let payload = {idutente: idutente, commessa: commessa, autorizzazione: autorizzazione};
    let chiaveprivata = fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem');
    let token = jwt.sign(payload, chiaveprivata, option);
    return token;
}

let checkToken = (token: any) => {
    let chiavePubblica = fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem');
    return jwt.verify(token, chiavePubblica, option)
}

module.exports = {
    setToken,
    getPayload,
    checkToken
}