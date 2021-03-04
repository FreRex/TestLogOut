import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';

const routes = require('./routes');
const app = express();
const port = 9083;

//--------------------
//SEZIONE ROUTE NODEJS
//--------------------


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
      console.log(`--------------------------------------------------------`);
      console.log(`https://www.collaudolive.com:${port}/room`);
      console.log(`https://www.collaudolive.com:${port}/progetti`);      
      console.log(`https://www.collaudolive.com:${port}/utenti`); 
      console.log(`--------------------------------------------------------`);
      console.log(`https://www.collaudolive.com:${port}/auth`); 
      console.log(`https://www.collaudolive.com:${port}/backoffice`);
      console.log(`https://www.collaudolive.com:${port}/projects`);     
  })