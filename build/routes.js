"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllerTest = require('./ctrl/controllerTest');
const controllerAlfaNumCasuale = require('./ctrl/controllerAlfaNumCasuale');
const controllerDownloadZip = require('./ctrl/controllerDownloadZip');
const controllerLogin = require('./ctrl/controllerLogin');
const controllerSincroDb = require('./ctrl/controllerSincroDb');
const controllerToken = require('./ctrl/controllerToken');
const controllerVidApp = require('./ctrl/controllerVidApp');
const controllerSelect = require('./ctrl/controllerSelect');
const controllerUpdate = require('./ctrl/controllerUpdate');
const controllerDelete = require('./ctrl/controllerDelete');
const controllerCreate = require('./ctrl/controllerCreate');
const mid = require('./middleware/mid');
const router = express_1.default.Router();
const cors = require('cors');
//__________________________________________________________________________________
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
//---------------------------------------------------------------------
//Test
router.get('/test/', controllerTest.test);
//--------------------------------------------------------------------
//Downloadzip (download foto compresse)
router.get('/checkdownloadzip/:folderzip/', controllerDownloadZip.CheckDownloadZip);
router.get('/downloadzip/:folderzip/', controllerDownloadZip.DownloadZip);
//Login
//router.get('/lgn/:usr/:pwd/:pkproject?', controllerLogin.checkLogin);
router.post('/lgn/', controllerLogin.checkLogin);
//SincroDb
router.get('/alfanumcasuale/', controllerAlfaNumCasuale.getAlfaNumeCasuale);
router.get('/sincrodb/:idutente?/:drawing?/:codicecasuale', controllerSincroDb.sincroDb);
router.get('/checksincrodb/:codicecasuale', controllerSincroDb.sincroDbCheck);
//Token
router.post('/token/', controllerToken.getToken);
//VidApp (riavvio Node Media Server)
router.get('/vidapp/', controllerVidApp.VidApp);
//------------------------------------------------------------------------
//----------- API-db -----------------------------------------------------
//------------------------------------------------------------------------
//Indirizzamento ad API-db di lettura (SELECT)
router.get('/s/:table/:idutcas?/:idroom?/', [mid.checkAuth], controllerSelect.getSelect);
//Indirizzamento ad API-db di modifica (UPDATE)
router.put('/ur/', [mid.checkAuth], controllerUpdate.putUpdateRoom);
router.put('/uu/', [mid.checkAuth], controllerUpdate.putUpdateUtenti);
router.put('/up/', [mid.checkAuth], controllerUpdate.putUpdateProgetti);
//Indirizzamento ad API-db di eliminazione (DELETE)
router.post('/d/', [mid.checkAuth], controllerDelete.delete);
//Indirizzamento ad API-db di creazione (POST)
router.post('/cu/', controllerCreate.postCreateUtenti);
router.post('/cp/', controllerCreate.postCreateProgetti);
router.post('/cr/', [mid.checkAuth], controllerCreate.postCreateRoom);
//------------------------------------------------------------------------
module.exports = router;
