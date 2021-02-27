const express = require('express');
const resDb = require('../controller');
const router = express.Router();
const bodyParser = require("body-parser");

router.get('/', function(req, res) {
    res.send('GET handler for / route.');
});

router.get('/apimultistreaming', function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader('Content-Type', 'application/json');    
    res.end(JSON.stringify(resDb.multistreamingQuery));

});


//se dovessimo prendere un solo oggetto prova con parametro
//router.get('/prove/:id/',provaController.getProve);

module.exports = router;