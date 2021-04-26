"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = (req, res, next) => {
    const codcasutente = require('.././middleware/idCasUtenti');
    let codicecasualeutente = codcasutente.idCasUtenti(8);
    console.log("ciaoo: " + codicecasualeutente);
};
