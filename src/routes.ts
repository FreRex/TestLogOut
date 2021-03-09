import express from 'express';
const controllerSelect = require('./ctrl/controllerSelect');
const controllerUpdate = require('./ctrl/controllerUpdate');
const router = express.Router();
const cors = require('cors');


router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    //res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



//Indirizzamento API di lettura (SELECT)
router.get('/s/:table/', controllerSelect.getSelect);
router.get('/s/:table/:id/', controllerSelect.getSelect);

//Indirizzamento API di modifica (UPDATE)
//router.get('/u/:table/',controllerUpdate.putUpdate);
//router.get('/u/:table/:id/:usermobile',controllerUpdate.putUpdate);
router.put('/ur/',controllerUpdate.putUpdateRoom);
router.put('/uu/',controllerUpdate.putUpdateUtenti);


module.exports = router;