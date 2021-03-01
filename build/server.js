"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
const routes = require('./routes/routes');
const app = express_1.default();
const port = 9083;
//--------------------
//SEZIONE ROUTE NODEJS
//--------------------
//Tirare su il FrontEnd (verso backoffice settato su Angular)
//app.use('/backoffice', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www')); });
//Tirare su Api
app.use('/', routes);
app.use('/apimultistreaming', routes);
//Tirare su il FrontEnd (verso PannAdmin settato su Angular)
//app.use('/PannAdmin',express.static(path.join(__dirname, '../frontend/www')));
//app.use('/backoffice',express.static(path.join(__dirname, '../frontend/www')));
app.use('/projects', routes);
//Tirare su il FrontEnd diretto su index.html
app.use('/*', (req, res) => { res.sendFile(path_1.default.join(__dirname, '../frontend/www/index.html')); });
//-------------------------------------
//-------------------------------------
//-------------------------------------
https_1.default.createServer({
    key: fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
}, app)
    .listen(port, () => {
    console.log(`https://www.collaudolive.com:${port}/apimultistreaming`);
    console.log(`https://www.collaudolive.com:${port}/PannAdmin`);
    console.log(`https://www.collaudolive.com:${port}/backoffice`);
});
