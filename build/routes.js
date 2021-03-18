"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllerSelect = require('./ctrl/controllerSelect');
const controllerUpdate = require('./ctrl/controllerUpdate');
const controllerDelete = require('./ctrl/controllerDelete');
const controllerCreate = require('./ctrl/controllerCreate');
const controllerToken = require('./ctrl/controllerToken');
const controllerVidApp = require('./ctrl/controllerVidApp');
const mid = require('./middleware/mid');
const router = express_1.default.Router();
const cors = require('cors');
router.use(cors());
router.use(function (req, res, next) {
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
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------
//VidApp (riavvio Node Media Server)
router.get('/vidapp/', controllerVidApp.VidApp);
//Token
router.post('/token/', controllerToken.getToken);
//----------- API-db -----------------------------------------------------
//Indirizzamento ad API-db di lettura (SELECT)
router.get('/s/:table/', [mid.checkAuth], controllerSelect.getSelect);
router.get('/s/:table/:id/', controllerSelect.getSelect);
//Indirizzamento ad API-db di modifica (UPDATE)
router.put('/ur/', controllerUpdate.putUpdateRoom);
router.put('/uu/', controllerUpdate.putUpdateUtenti);
router.put('/up/', controllerUpdate.putUpdateProgetti);
//Indirizzamento ad API-db di modifica (DELETE)
router.post('/d/', controllerDelete.delete);
//Indirizzamento ad API-db di creazione (POST)
router.post('/cu/', controllerCreate.postCreateUtenti);
router.post('/cp/', controllerCreate.postCreateProgetti);
router.post('/cr/', controllerCreate.postCreateRoom);
//------------------------------------------------------------------------
module.exports = router;
