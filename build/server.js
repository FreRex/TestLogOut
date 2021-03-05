"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const routes = require('./routes');
const app = express_1.default();
const port = 9083;
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
https_1.default.createServer({
    key: fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
}, app)
    .listen(port, () => {
    console.log(`-------------------- API -----------------------------------`);
    console.log(`https://www.collaudolive.com:${port}/select/room`);
    console.log(`https://www.collaudolive.com:${port}/select/progetti`);
    console.log(`https://www.collaudolive.com:${port}/select/utenti`);
    console.log(`-------------------- FRONTEND ------------------------------`);
    console.log(`https://www.collaudolive.com:${port}/auth`);
    console.log(`https://www.collaudolive.com:${port}/backoffice`);
    console.log(`https://www.collaudolive.com:${port}/projects`);
});
