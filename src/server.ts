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

//app.use('/projects',express.static('/var/www/html/chat-operativa/frontend/www/index.html'));
//app.use('/projects',express.static(path.join(__dirname, '../frontend/www')));
//app.use('/projects', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www')); });
//app.use('/*', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www/index.html')); });

app.use('/', routes);

app.use('/',express.static(path.join(__dirname, '../frontend/www')));
app.use('/*', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www/index.html')); });




//-------------------------------------
//-------------------------------------
//-------------------------------------

https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
  }, app)
    
  .listen(port, () => {        
      console.log(`https://www.collaudolive.com:${port}/apimultistreaming`);
      console.log(`https://www.collaudolive.com:${port}/backoffice`);      
  })