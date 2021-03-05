import express from 'express';
const controllerSelect = require('./controllerSelect');
const router = express.Router();

//Indirizzamento API di lettura (SELECT)
router.get('/select/:table/',controllerSelect.getSelect);
router.get('/select/:table/:id/',controllerSelect.getSelect);

//Indirizzamento API di modifica (UPDATE)
//router.put('/update/:table/',controllerSelect.getSelect);
//router.put('/update/:table/:id/',controllerSelect.getSelect);

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