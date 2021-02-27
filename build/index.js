"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const https_1 = __importDefault(require("https"));
const fs_1 = __importDefault(require("fs"));
// rest of the code remains same
const app = express_1.default();
const port = 9083;
app.use('/PannAdmin', express_1.default.static(path_1.default.join(__dirname, '../frontend/www')));
app.get('/ApiSsl', function (req, res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify([
        { usermobile: 'collevecchioSsl', progetto: 'Collevecchio090221', linkprogetto: 'Progetto Collevecchio090221', collaudatore: 'Federica Vastola' },
        { usermobile: 'ranicaServer', progetto: 'Ranica', linkprogetto: 'Progetto Ranica', collaudatore: 'Desire Peci' },
        { usermobile: 'mairago', progetto: 'MAIRAGO_COLLAUDO', linkprogetto: 'Progetto Ranica', collaudatore: 'Serena Vioto' }
    ]));
});
app.use('/*', (req, res) => { res.sendFile(path_1.default.join(__dirname, '../frontend/www/index.html')); });
//-------------------------------------------------------------------------------
// PARTE PER PRODUZIONE
//-------------------------------------------------------------------------------
https_1.default.createServer({
    key: fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
}, app)
    .listen(port, () => {
    console.log(`https://www.collaudolive.com:${port}/PannAdmin`);
});
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
/*
//---------------------------------------------------------------------------
// PARTE PER SVILUPPO
//---------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/PannAdmin`)
})
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
*/ 
