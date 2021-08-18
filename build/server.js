"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const child_process_1 = require("child_process");
const routes = require('./routes');
const functionListaConference = require('./assets/functionListaConference');
const { exec } = require("child_process");
const app = express_1.default();
let port;
if (process.env.NODE_ENV == 'production') {
    require('dotenv').config();
    port = process.env.PORT_PROD || 9666;
}
else {
    port = 9187;
}
//app.use(express.json());
app.use(express_1.default.json({ limit: '50mb' }));
app.use(express_1.default.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));
//-----------------------------------------------------------------------------------------------------------
//SEZIONE ROUTE NODEJS
//-----------------------------------------------------------------------------------------------------------
// Indirizzamento verso route API
app.use('/', routes);
//Indirizzamento verso route FRONTEND
app.use('/', express_1.default.static(path_1.default.join(__dirname, '../frontend/www')));
app.use('/*', (req, res) => { res.sendFile(path_1.default.join(__dirname, '../frontend/www/index.html')); });
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------
const server = require('https').createServer({
    key: fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    cert: fs_1.default.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
}, app);
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
const io = require('socket.io')(server, {
    cors: {
        origini: `https://www.chop.click:${port}`,
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});
child_process_1.spawn('ffmpeg', ['-h']).on('error', function (m) {
    console.error("FFMpeg not found in system cli; please install ffmpeg properly or make a softlink to ./!");
    process.exit(-1);
});
//-----------------------------------------------------------------------------------------
//------------------------- Socket connection ---------------------------------------------
//-----------------------------------------------------------------------------------------
// Connessione socket.io
io.on('connection', function (socket) {
    //SOCKET PER CHAT TESTUALE
    //Connected/Disconnect
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
    //Message
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
        console.log('message: ' + msg);
    });
    //SOCKET PER KMZ
    socket.on('kmzemit', function (kmz_data) {
        console.log('kmz_data: ' + kmz_data.kmz);
        socket.broadcast.emit('kmzon', { kmz: kmz_data.kmz });
    });
    //SOCKET PER POSIZIONAMENTO / GPS / COORDINATE
    socket.on('gps', function (gps_data) {
        /* console.log('gps_data.idroom: ' +gps_data.idroom);
        console.log('gps_data.latitudine: ' +gps_data.latitudine);
        console.log('gps_data.longitudine: ' +gps_data.longitudine); */
        socket.broadcast.emit('gpsUtente_idroom_' + gps_data.idroom, { idroom: gps_data.idroom, latitudine: gps_data.latitudine, longitudine: gps_data.longitudine });
    });
    socket.on('posizioneMarker', function (posMkr) {
        /* console.log('posMkr.idroom: ' +posMkr.idroom);
        console.log('posMkr.latitudine: ' +posMkr.latitudine);
        console.log('posMkr.longitudine: ' +posMkr.longitudine);
        console.log('posMkrBckEnd_'+posMkr.idroom); */
        socket.broadcast.emit('posMkrBckEnd_' + posMkr.idroom, { idroom: posMkr.idroom, latitudine: posMkr.latitudine, longitudine: posMkr.longitudine });
    });
    //----------------------------
    // Socket per streaming
    socket.emit('message', { type: 'welcome', data: 'Hello from mediarecorder-to-rtmp server!' });
    socket.emit('message', { type: 'welcome', data: 'Please set rtmp destination before start streaming.' });
    socket.on('first_idroom', function (first_idroom) {
        let indexSingleRoom = functionListaConference.checkPresenzaIdRoom(Number(first_idroom));
        socket.emit('lista_utenti', functionListaConference.utentiInConference[indexSingleRoom]);
    });
    let ffmpeg_process;
    let feedStream = false;
    // Ricezione tramite socket url_rtmp, socket.id e relativa elaborazione
    socket.on('config_rtmpDestination', function (m) {
        let socketid = socket.id;
        let regexValidator = /^rtmp:\/\/[^\s]*$/; //TODO: should read config		
        if (typeof m.rtmp != 'string') {
            socket.emit('message', { type: 'welcome', data: 'rtmp destination setup error.' });
            return;
        }
        else if (!regexValidator.test(m.rtmp)) {
            //socket.emit('fatal','rtmp address rejected.');
            socket.emit('message', { type: 'fatal', data: 'rtmp address rejected.' });
            return;
        }
        else {
            //Test x verifica start streaming
            socket._rtmpDestination = m.rtmp;
            let nomeUtente = m.nome;
            let dataforsocket = 'rtmp destination set to: ' + m.rtmp;
            //console.log(socket._rtmpDestination);
            let numberRoom = functionListaConference.idroomsplit(socket._rtmpDestination);
            let identificativoUtente = functionListaConference.idutentesplit(socket._rtmpDestination);
            //Inserimento in array generale dei dati del nuovo utente in conference
            let insertArray = functionListaConference.userInConferenceVideo(Number(numberRoom), identificativoUtente, 'entrance', socketid, nomeUtente);
            //Determinazione singolo array specifico per il nuovo utente			
            let indexSingleRoom = functionListaConference.checkPresenzaIdRoom(Number(numberRoom));
            console.log("Index room: " + indexSingleRoom);
            let insertArraySingleRoom = functionListaConference.utentiInConference[indexSingleRoom];
            console.log(insertArraySingleRoom);
            //Invio messaggi di benvenuto 
            //invio lista utenti presenti in conference
            socket.emit('message', { type: 'welcome', data: dataforsocket });
            socket.emit('message', { type: numberRoom, data: insertArraySingleRoom });
            socket.broadcast.emit('message', { type: numberRoom, data: insertArraySingleRoom });
        }
    });
    //Configurazione codec
    socket.on('config_vcodec', function (m) {
        //Verifica errori in codev
        if (typeof m != 'string') {
            socket.emit('message', { type: 'fatal', data: 'input codec setup error.' });
            return;
        }
        if (!/^[0-9a-z]{2,}$/.test(m)) {
            socket.emit('message', { type: 'fatal', data: 'input codec contains illegal character?.' });
            return;
        } //for safety
        //-----------------------
        socket._vcodec = m;
    });
    socket.on('start', function (m) {
        //Al premere del pulsante start-streaming:
        // 1) identificare l'array per la room specifica		
        let elementoCoordinate = functionListaConference.checkPresenzaSocketid(socket.id);
        let arrayRoom = functionListaConference.utentiInConference[elementoCoordinate.y];
        console.log('arrayRoom: ' + arrayRoom);
        // 2) Se attivo qualche processo (se esiste un pid stream nell'array) killiamo tutti i processi stream ed inviamo il socket.emit(stopWebCam...
        if (functionListaConference.checkpidstream(arrayRoom) != 0) {
            console.log('pidstream: ' + functionListaConference.checkpidstream(arrayRoom));
            // 1) killare il processo:
            let pidstreamKill = 0;
            pidstreamKill = functionListaConference.checkpidstream(arrayRoom);
            console.log('pidstreamKill: ' + pidstreamKill);
            //Distruggi il processo ffmpeg
            let numberRoom = functionListaConference.idroomsplit(socket._rtmpDestination);
            exec("kill -9 " + pidstreamKill, (error, stdout, stderr) => {
                if (stdout) {
                    console.log(`stdout: ${stdout.message}`);
                    return;
                }
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr.message}`);
                    return;
                }
                socket.broadcast.emit('message', { type: 'stopWebCam', data: numberRoom });
            });
        }
        //Verifica errori 
        if (ffmpeg_process || feedStream) {
            ffmpeg_process = false;
            feedStream = false;
        }
        //- verifica che non sia presente una url_rtmp
        if (!socket._rtmpDestination) {
            socket.emit('message', { type: 'fatal', data: 'no destination given.' });
            return;
        }
        //Impostazioni parametri per audio streaming
        var audioBitrate = parseInt(socket.handshake.query.audioBitrate);
        var audioEncoding = "64k";
        if (audioBitrate == 11025) {
            audioEncoding = "11k";
        }
        else if (audioBitrate == 22050) {
            audioEncoding = "22k";
        }
        else if (audioBitrate == 44100) {
            audioEncoding = "44k";
        }
        console.log(audioEncoding, audioBitrate);
        //Impostazioni parametri per video streaming
        var framerate = socket.handshake.query.framespersecond;
        console.log('framerate on node side', framerate);
        //var ops = [];
        if (framerate == 1) {
            var ops = [
                '-i', '-',
                '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
                //'-max_muxing_queue_size', '1000', 
                //'-bufsize', '5000',
                '-r', '1', '-g', '2', '-keyint_min', '2',
                '-x264opts', 'keyint=2', '-crf', '25', '-pix_fmt', 'yuv420p',
                '-profile:v', 'baseline', '-level', '3',
                '-c:a', 'aac', '-b:a', audioEncoding, '-ar', audioBitrate,
                '-f', 'flv', socket._rtmpDestination
            ];
        }
        else {
            if (framerate == 15) {
                var ops = [
                    '-i', '-',
                    '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
                    '-max_muxing_queue_size', '1000',
                    '-bufsize', '5000',
                    '-r', '15', '-g', '30', '-keyint_min', '30',
                    '-x264opts', 'keyint=30', '-crf', '25', '-pix_fmt', 'yuv420p',
                    '-profile:v', 'baseline', '-level', '3',
                    '-c:a', 'aac', '-b:a', audioEncoding, '-ar', audioBitrate,
                    '-f', 'flv', socket._rtmpDestination
                ];
            }
            else {
                var ops = [
                    '-i', '-',
                    //'-c', 'copy', 
                    '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',
                    '-c:a', 'aac', '-ar', audioBitrate, '-b:a', audioEncoding,
                    //'-max_muxing_queue_size', '4000', 
                    //'-y', //force to overwrite
                    //'-use_wallclock_as_timestamps', '1', // used for audio sync
                    //'-async', '1', // used for audio sync
                    //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
                    //'-strict', 'experimental', 
                    '-bufsize', '5000',
                    '-f', 'flv', socket._rtmpDestination
                    /*. original params
                    '-i','-',
                    '-c:v', 'libx264', '-preset', 'veryfast', '-tune', 'zerolatency',  // video codec config: low latency, adaptive bitrate
                    '-c:a', 'aac', '-ar', '44100', '-b:a', '64k', // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
                    '-y', //force to overwrite
                    '-use_wallclock_as_timestamps', '1', // used for audio sync
                    '-async', '1', // used for audio sync
                    //'-filter_complex', 'aresample=44100', // resample audio to 44100Hz, needed if input is not 44100
                    //'-strict', 'experimental',
                    '-bufsize', '1000',
                    '-f', 'flv', socket._rtmpDestination
                    */
                ];
            }
        }
        console.log("ops", ops);
        console.log(socket._rtmpDestination);
        ffmpeg_process = child_process_1.spawn('ffmpeg', ops);
        console.log("ffmpeg spawned");
        console.log("ffmpeg_process.pid: " + ffmpeg_process.pid);
        //- Rendere "false" tutti gli "stream" e true quello specifico, aggiornare il valore di "pidstream"
        // Infine inviare tramite socket.emit(type: numberRoom, data: arrayStream
        // di conseguenza si attiva sia lo stream che il player 
        if (socket.id) {
            let socketidCoo = functionListaConference.checkPresenzaSocketid(socket.id);
            let numberRoom = functionListaConference.utentiInConference[socketidCoo.y][0];
            numberRoom = numberRoom.toString();
            console.log("numberoom per update: " + numberRoom);
            let arrayStream = functionListaConference.updateStream(socket.id, ffmpeg_process.pid);
            console.log(arrayStream);
            socket.emit('message', { type: numberRoom, data: arrayStream });
            socket.broadcast.emit('message', { type: numberRoom, data: arrayStream });
            //Riavvio player (start.player)
            socket.broadcast.emit('message', { type: 'startPlayer_' + numberRoom, data: arrayStream });
        }
        feedStream = function (data) {
            ffmpeg_process.stdin.write(data);
        };
        //Ricezione da FFMPEG lo streaming nel formato per il RTMP
        ffmpeg_process.stderr.on('data', function (d) {
            let dato_ffmpeg = d.toString('utf8');
            //console.log(dato_ffmpeg);
            //inserimento dati rate nel db	
            //InsertRateDb.insertRateVideo(d.toString('utf8'));
            //Check BLOCCO VIDEO---------
            if (dato_ffmpeg.search('Fatal ERROR: unexpected:rtmp not set yet') != -1) {
                console.log('Fatal ERROR: unexpected:rtmp not set yet --> BLOCCO VIDEO ???');
                socket.broadcast.emit('message', { type: 'bloccoVideoRtmp', data: 'Fatal ERROR: unexpected:rtmp not set yet' });
            }
            if (dato_ffmpeg.search('Fatal ERROR') != -1) {
                console.log('Fatal ERROR --> BLOCCO VIDEO ???');
                socket.broadcast.emit('message', { type: 'bloccoVideoRtmp', data: 'Fatal ERROR' });
            }
            if (dato_ffmpeg.search('Cannot read property') != -1) {
                console.log('Cannot read property --> BLOCCO VIDEO ???');
                socket.broadcast.emit('message', { type: 'bloccoVideoRtmp', data: 'Cannot read property' });
            }
            //Check LATENZA/CLOCCO VIDEO---------
            if (dato_ffmpeg.search('Queue input is backward in time') != -1) {
                console.log('Queue input is backward in time --> LATENZA VIDEO ???');
                socket.broadcast.emit('message', { type: 'latenzaVideoRtmp', data: 'Queue input is backward in time' });
            }
            if (dato_ffmpeg.search('speed=0.') != -1) {
                console.log('speed < 0.yy --> LATENZA VIDEO/BLOCCO VIDEO ???');
                socket.broadcast.emit('message', { type: 'latenzaVideoRtmp', data: 'speed < 0.yy' });
            }
            let ffmpeg_stderrforsocket = 'ffmpeg_stderr ' + d;
            socket.emit('message', { type: 'info', data: ffmpeg_stderrforsocket });
        });
        // --- Error
        ffmpeg_process.on('error', function (e) {
            console.log('child process error ' + e);
            let ffmpeg_error = 'ffmpeg error! ' + e;
            socket.emit('message', { type: 'fatal', data: ffmpeg_error });
            feedStream = false;
            socket.disconnect();
        });
        //--- Exit
        ffmpeg_process.on('exit', function (e) {
            console.log('child process exit ' + e);
            //socket.emit('fatal','ffmpeg exit!'+e);
            let ffmpeg_exit = 'ffmpeg exit  ! ' + e;
            socket.emit('message', { type: 'fatal', data: ffmpeg_exit });
            //socket.disconnect();
        });
    });
    //---------------------------- fine codice socket start --------------
    //--------------------------------------------------------------------
    socket.on('binarystream', function (m) {
        if (!feedStream) {
            socket.emit('message', { type: 'fatal', data: 'rtmp not set yet.' });
            ffmpeg_process.stdin.end();
            ffmpeg_process.kill('SIGINT');
            return;
        }
        feedStream(m);
    });
    //Ricezione segnale per click pulsnate "stop stream"
    socket.on('disconnectStream', function (m) {
        //PULSANTE STOP STREAM PREMUTO
        console.log('PULSANTE STOP STREAM PREMUTO');
        let socketid = socket.id;
        let socketidCoo = functionListaConference.checkPresenzaSocketid(socketid);
        let numberRoom = functionListaConference.utentiInConference[socketidCoo.y][0];
        numberRoom = numberRoom.toString();
        console.log('----------------------------------------');
        console.log("Chiusura stream per il seguente id: " + socketid);
        //console.table('NumberRoom: ' + numberRoom);
        //feedStream=false;			
        //Update stream da true a false
        let arrayUser = functionListaConference.updateStreamFalse(socketid);
        //Verifica		
        if (ffmpeg_process) {
            ffmpeg_process.stdin.end();
            ffmpeg_process.kill('SIGINT');
            console.log("ffmpeg process ended ! (CHIUSURA STREAMING DA DISCONNECTSTREAM");
            //invio lista utenti presenti in conference
            socket.emit('message', { type: numberRoom, data: arrayUser });
            socket.broadcast.emit('message', { type: numberRoom, data: arrayUser });
        }
        else {
            console.warn('killing ffmpeg process attempt failed...(DA DISCONNECTSTREAM")');
            //invio lista utenti presenti in conference
            socket.emit('message', { type: numberRoom, data: arrayUser });
            socket.broadcast.emit('message', { type: numberRoom, data: arrayUser });
        }
        socket.broadcast.emit('message', { type: 'stopPlayer_' + numberRoom, data: arrayUser });
        console.log('----------------------------------------');
        console.log('----------------------------------------');
    });
    //Ricezione segnale di disconnessione per chiusura browser.
    socket.on('disconnect', function (m) {
        let socketid = socket.id;
        let socketidCoo = functionListaConference.checkPresenzaSocketid(socketid);
        let numberRoom = functionListaConference.utentiInConference[socketidCoo.y][0];
        numberRoom = numberRoom.toString();
        //console.table('NumberRoom: ' + numberRoom);
        feedStream = false;
        console.log("Browser closed --> streaming  disconnected ! " + socketid);
        //Eliminazione utente in conference
        let arrayUser = functionListaConference.userInConferenceVideo(numberRoom, '', 'exitUser', socketid);
        if (ffmpeg_process) {
            //invio lista utenti presenti in conference
            socket.emit('message', { type: numberRoom, data: arrayUser });
            socket.broadcast.emit('message', { type: numberRoom, data: arrayUser });
            ffmpeg_process.stdin.end();
            ffmpeg_process.kill('SIGINT');
            console.log("ffmpeg process ended ! (DISCONNECT DA CHIUSURA BROWSER)");
        }
        else {
            //invio lista utenti presenti in conference
            socket.emit('message', { type: numberRoom, data: arrayUser });
            socket.broadcast.emit('message', { type: numberRoom, data: arrayUser });
            console.warn('killing ffmpeg process attempt failed... (DISCONNECT DA CHIUSURA BROWSER)');
        }
    });
    socket.on('error', function (e) {
        console.log('socket.io error:' + e);
    });
});
io.on('error', function (e) {
    console.log('socket.io error:' + e);
});
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
server.listen(port, function () {
    console.log(`https://www.collaudolive.com:${port}`);
});
process.on('uncaughtException', function (err) {
    // handle the error safely
    console.log('Errore :' + err);
    // Note: after client disconnect, the subprocess will cause an Error EPIPE, which can only be caught this way.
});
