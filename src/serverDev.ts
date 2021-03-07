import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';

const routes = require('./routes');
const app = express();
const port = 9084;

//--------------------
//SEZIONE ROUTE NODEJS
//--------------------

// Indirizzamento verso route API
app.use('/', routes);

//Indirizzamento verso route FRONTEND
app.use('/',express.static(path.join(__dirname, '../frontend/www')));
app.use('/*', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www/index.html')); });


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
  })