import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';

const routes = require('./routes');
 
const app = express();
const port = 9187;

app.use(express.json());


//-----------------------------------------------------------------------------------------------------------
//SEZIONE ROUTE NODEJS
//-----------------------------------------------------------------------------------------------------------

// Indirizzamento verso route API
app.use('/', routes);

//Indirizzamento verso route FRONTEND
app.use('/',express.static(path.join(__dirname, '../frontend/www')));
app.use('/*', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www/index.html')); });

//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------

https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
  }, app)
    
  .listen(port, () => { 
    console.log(`https://www.collaudolive.com:${port}/alfanumcasuale`); 
    
    console.log(`-------------------- TEST ------------------------------`);
    console.log(`https://www.collaudolive.com:${port}/test`); 

    console.log(`-------------------- SINCRODB ------------------------------`);
    console.log(`https://www.collaudolive.com:${port}/sincrodb/32/1533947027/111`);   

    console.log(`-------------------- FRONTEND ------------------------------`);
    console.log(`https://www.collaudolive.com:${port}/auth`); 
    console.log(`https://www.collaudolive.com:${port}/backoffice`);
    console.log(`https://www.collaudolive.com:${port}/rooms`); 
    
    console.log(`-------------------- FRONTEND ------------------------------`);
    console.log(`https://www.collaudolive.com:${port}/vidapp`); 

    console.log(`-------------------- API SELECT-----------------------------------`);
    console.log(`https://www.collaudolive.com:${port}/s/room`); 
    console.log(`https://www.collaudolive.com:${port}/s/progetti`);       
    console.log(`https://www.collaudolive.com:${port}/s/utenti`);

    console.log(`-------------------- API UPDATE-----------------------------------`);    
    console.log(`https://www.collaudolive.com:${port}/ur/`);    
    console.log(`https://www.collaudolive.com:${port}/up/`); 
    console.log(`https://www.collaudolive.com:${port}/uu/`); 

    
  })