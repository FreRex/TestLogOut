"use strict";
exports.getAlfaNumeCasuale = (req, res, next) => {
    const codcasuale = require('.././middleware/alfaNumeCasuale');
    let codcas = codcasuale.alfaNumeCasuale(10);
    console.log('Codice casuale univoco: ' + codcas);
    res.json(codcas);
};
