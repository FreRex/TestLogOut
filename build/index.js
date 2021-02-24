const express = require('express');
//let cors = require('cors')
const https = require('https');
let app = express();
let fs = require('fs');
const port = 9089;

//app.use(cors());

app.use('/PannAdmin',express.static('/var/www/html/chat-operativa/frontend/www'));

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

//app.use('/MyApp',express.static('/var/www/html/CHOPDEF1/frontend/www'))

app.use('/*', (req, res) => { res.sendFile('/var/www/html/chat-operativa/frontend/www/index.html'); });

https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
  }, app)
  
  .listen(port, () => {
      console.log(`https://www.collaudolive.com:${port}/PannAdmin`)        
  })

