"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Controller = require('./controller');
const router = express_1.default.Router();
router.get('/room/', Controller.getRoom);
router.get('/progetti/', Controller.getProgetti);
router.get('/utenti/', Controller.getUtenti);
router.get('/utenti/:id/', Controller.getUtenti);
module.exports = router;
