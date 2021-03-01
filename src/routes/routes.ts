import express from 'express';
import path from 'path';
const resDb = require('../controller');
const router = express.Router();
import bodyParser from "body-parser";

router.get('/', function(req, res) {
    res.send('GET handler for / route.');
});

router.get('/apimultistreaming', function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader('Content-Type', 'application/json');    
    res.end(JSON.stringify(resDb.multistreamingQuery));

});

router.get('/backoffice', function(req, res) {
    res.send(express.static(path.join(__dirname, '../frontend/www')));
});

router.get('/backoffice',express.static(path.join(__dirname, '../frontend/www')));

//se dovessimo prendere un solo oggetto prova con parametro.
//router.get('/prove/:id/',provaController.getProve);

module.exports = router;