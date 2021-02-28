import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';

const routes = require('./routes/routes');

const app = express();
const port = 9083;

//--------------------
//SEZIONE ROUTE NODEJS
//--------------------

//Tirare su il FrontEnd (verso PannAdmin settato su Angular)
app.use('/projects',express.static(path.join(__dirname, '../frontend/www')));

//Tirare su il FrontEnd (verso backoffice settato su Angular)
app.use('/backoffice', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www')); });

//Tirare su Api
app.use('/', routes);
app.use('/apimultistreaming', routes);

//Tirare su il FrontEnd diretto su index.html
app.use('/*', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www/index.html')); });

//-------------------------------------
//-------------------------------------
//-------------------------------------


https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
  }, app)
    
  .listen(port, () => {
      console.log(`https://www.collaudolive.com:${port}`);   
      console.log(`https://www.collaudolive.com:${port}/apimultistreaming`);
      console.log(`https://www.collaudolive.com:${port}/PannAdmin`) 
      console.log(`https://www.collaudolive.com:${port}/backoffice`)
  })
