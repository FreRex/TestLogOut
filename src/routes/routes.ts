import express from 'express';
import path from 'path';
const resDb = require('../controller');
const router = express.Router();
import bodyParser from "body-parser";

router.get('/apiprogetti', function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader('Content-Type', 'application/json');    
    res.end(JSON.stringify(resDb.progettiQuery));

});

router.get('/apimultistreaming', function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader('Content-Type', 'application/json');    
    res.end(JSON.stringify(resDb.multistreamingQuery));

});

router.get('/apiutenti', function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader('Content-Type', 'application/json');    
    res.end(JSON.stringify(resDb.utenti));

});


//se dovessimo prendere un solo oggetto prova con parametro.
//router.get('/prove/:id/',provaController.getProve);

module.exports = router;