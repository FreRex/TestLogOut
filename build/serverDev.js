"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const routes = require('./routes');
const app = express_1.default();
const port = 9084;
//--------------------
//SEZIONE ROUTE NODEJS
//--------------------
// Indirizzamento verso route API
app.use('/', routes);
//Indirizzamento verso route FRONTEND
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../frontend/www')));
app.use('/*', (req, res) => { res.sendFile(path_1.default.join(__dirname, '../frontend/www/index.html')); });
//-------------------------------------
//-------------------------------------
//-------------------------------------
app.listen(port, () => {
    console.log(`-------------------- API -----------------------------------`);
    console.log(`http://localhost:${port}/s/room`);
    console.log(`http://localhost:${port}/s/progetti`);
    console.log(`http://localhost:${port}/s/utenti`);
    console.log(`---------------------FRONTEND-------------------------------`);
    console.log(`http://localhost:${port}/auth`);
    console.log(`http://localhost:${port}/backoffice`);
    console.log(`http://localhost:${port}/projects`);
});
