import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';

// rest of the code remains same
const app = express();
const port = 9083;

app.use('/PannAdmin',express.static(path.join(__dirname, '../frontend/www')));

app.get('/ApiSsl', function(req, res) {

    res.setHeader("Access-Control-Allow-Origin", "*"); 
    res.setHeader('Content-Type', 'application/json');    
    res.end(JSON.stringify(
      [ 
        { usermobile: 'collevecchioSsl', progetto: 'Collevecchio090221', linkprogetto: 'Progetto Collevecchio090221', collaudatore: 'Federica Vastola' },
        { usermobile: 'ranicaServer', progetto: 'Ranica', linkprogetto: 'Progetto Ranica', collaudatore: 'Desire Peci' },
        { usermobile: 'mairago', progetto: 'MAIRAGO_COLLAUDO', linkprogetto: 'Progetto Ranica', collaudatore: 'Serena Vioto' }
      ] 
    ));

});

app.use('/*', (req, res) => { res.sendFile(path.join(__dirname, '../frontend/www/index.html')); });

/*
//-------------------------------------------------------------------------------
// PARTE PER PRODUZIONE
//-------------------------------------------------------------------------------
https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
  }, app)
  
  .listen(port, () => {
      console.log(`https://www.collaudolive.com:${port}/PannAdmin`)        
  })
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
*/

//---------------------------------------------------------------------------
// PARTE PER SVILUPPO
//---------------------------------------------------------------------------
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}/PannAdmin`)
})
//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
