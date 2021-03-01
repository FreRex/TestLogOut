"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const resDb = require('../controller');
const router = express_1.default.Router();
router.get('/', function (req, res) {
    res.send('GET handler for / route.');
});
router.get('/apimultistreaming', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(resDb.multistreamingQuery));
});
router.get('/backoffice', function (req, res) {
    res.send(express_1.default.static(path_1.default.join(__dirname, '../frontend/www')));
});
router.get('/backoffice', express_1.default.static(path_1.default.join(__dirname, '../frontend/www')));
//se dovessimo prendere un solo oggetto prova con parametro.
//router.get('/prove/:id/',provaController.getProve);
module.exports = router;
