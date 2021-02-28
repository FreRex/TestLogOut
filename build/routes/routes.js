"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
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
//se dovessimo prendere un solo oggetto prova con parametro.
//router.get('/prove/:id/',provaController.getProve);
module.exports = router;
