import express from 'express';
const controllerSelect = require('./ctrl/controllerSelect');
const controllerUpdate = require('./ctrl/controllerUpdate');
const router = express.Router();


//Indirizzamento API di lettura (SELECT)
router.get('/s/:table/',controllerSelect.getSelect);
router.get('/s/:table/:id/',controllerSelect.getSelect);

//Indirizzamento API di modifica (UPDATE)
router.put('/u/:table/',controllerUpdate.putUpdate);
router.put('/u/:table/:id/:usermobile',controllerUpdate.putUpdate);

//Indirizzamento API di lettura (SELECT)
/*
router.get('/select/:table/', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.end(controllerSelect.getSelect);
});

router.get('/select/:table/:id/', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.end(controllerSelect.getSelect);
});
*/

//router.get('/select/:table/:id/',controllerSelect.getSelect);


module.exports = router;