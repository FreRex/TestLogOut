"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllerSelect = require('./ctrl/controllerSelect');
const controllerUpdate = require('./ctrl/controllerUpdate');
const router = express_1.default.Router();
//Indirizzamento API di lettura (SELECT)
router.get('/s/:table/', controllerSelect.getSelect);
router.get('/s/:table/:id/', controllerSelect.getSelect);
//Indirizzamento API di modifica (UPDATE)
//router.put('/u/:table/',controllerUpdate.getUpdate);
//router.put('/u/:table/:id/',controllerUpdate.getUpdate);
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
