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
const app = express_1.default();
let port;
if (process.env.NODE_ENV == 'production') {
    require('dotenv').config();
    port = process.env.PORT_PROD || 9666;
}
else {
    port = 9187;
}
app.use(express_1.default.json());
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
/*
https.createServer({
 
    key: fs.readFileSync('/etc/letsencrypt/live/www.chop.click/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/www.chop.click/cert.pem')
  }, app)
    
  .listen(port, () => {
           
    console.log(`-------------------- TEST ------------------------------`);
    console.log(`https://www.collaudolive.com:${port}/test`);
    
  }) */
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//var io = require('socket.io')(server);
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
    console.log('zzzzz:');
    console.error("FFMpeg not found in system cli; please install ffmpeg properly or make a softlink to ./!");
    process.exit(-1);
});
//---------------------------------------------------------------
//---------------------------------------------------------------
// --- Sezione per presenza utenti in conference
//---------------------------------------------------------------
//---------------------------------------------------------------
let utentiInConference = [];
//-------------------- DELETE ROW IN MULTIDIMENSIONAL ARRAY
function deleteRow(arr, row) {
    arr = arr.slice(0); // make copy
    arr.splice(row - 1, 1);
    return arr;
}
//-------------------- SPLIT RTMP -----------------------------------
function idutentesplit(urlrtmp) {
    let idutenteinside = urlrtmp.split('/');
    let idutenteidentificato = idutenteinside[idutenteinside.length - 1];
    return idutenteidentificato;
}
function idroomsplit(urlrtmp) {
    let idroominside = urlrtmp.split('/');
    let idroomidentificata = idroominside[idroominside.length - 2];
    return idroomidentificata;
}
//--------------------- CHECK PRESENZA (POSIZIONE) ----------------------------------
function checkPresenzaIdRoom(idroom) {
    let checkPresenzaFinaleIdRoom = -1;
    for (let index = 0; index < utentiInConference.length; index++) {
        if (utentiInConference[index].includes(idroom)) {
            checkPresenzaFinaleIdRoom = index;
        }
    }
    return checkPresenzaFinaleIdRoom;
}
function checkPresenzaIdUtente(idroom, idutente) {
    let checkPresenzaFinaleIdUtente = -1;
    let index = checkPresenzaIdRoom(idroom);
    if (utentiInConference[index].includes(idutente) >= 0) {
        //checkPresenzaFinaleIdUtente = index;
        checkPresenzaFinaleIdUtente = utentiInConference[index].indexOf(idutente);
    }
    return checkPresenzaFinaleIdUtente;
}
//-------------------------------------------------------
function userInConferenceVideo(idroom, idutente, dataAction) {
    console.log('1');
    let userInConferenceVideo = utentiInConference;
    // "idutente" vuole ENTRARE in conference	
    if (checkPresenzaIdRoom(idroom) >= 0) {
        console.log('2');
        //ELIMINARE ROOM
        if (dataAction == 'exitRoom') {
            console.log("Eliminare room dall'array");
            console.log("idroom: " + checkPresenzaIdRoom(idroom));
            console.table(deleteRow(utentiInConference, checkPresenzaIdRoom(idroom) + 1));
            userInConferenceVideo = deleteRow(utentiInConference, checkPresenzaIdRoom(idroom) + 1);
        }
        else {
            console.log('3');
            if (checkPresenzaIdUtente(idroom, idutente) >= 0) {
                console.log('Idroom PRESENTE E idutente PRESENTE');
                //Utente presente, ma dataAction=='exitUser' => bisogna eliminarlo dall'array !
                if (dataAction == 'exitUser') {
                    //ELIMINARE UTENTE
                    console.log("Eliminare partecipante dall'array");
                    utentiInConference[checkPresenzaIdRoom(idroom)].splice(checkPresenzaIdUtente(idroom, idutente), 1);
                    userInConferenceVideo = utentiInConference;
                }
            }
            else 
            //UTENTE NON PRESENTE --> INSERIRE UTENTE NELL'ARRAY ! 
            {
                console.log("Utente NON presente inserire utente nell'ARRAY");
                utentiInConference[checkPresenzaIdRoom(idroom)].push(idutente);
                userInConferenceVideo = utentiInConference;
            }
        }
    }
    else 
    // INSERIRE ROOM ED UTENTE
    {
        console.log("idroom NON PRESENTE e di conseguenza NON presente anche l'idutente => bisogna inserirli entrambi nell'array !");
        //idroom NON PRESENTE e di conseguenza NON presente anche l'idutente => bisogna inserirli entrambi nell'array !       
        utentiInConference.push([idroom, idutente]);
        userInConferenceVideo = utentiInConference;
    }
    return userInConferenceVideo;
}
//_______________________________________________________________________________________________________________________
//_______________________________________________________________________________________________________________________
//_______________________________________________________________________________________________________________________
//let idroom = idroomsplit(urlrtmp: string);
//let idutente =  idutentesplit(urlrtmp);
//let dataAction ='';
//----------------------------------------------------
/* console.log(idroom);
console.log(idutente);
console.log(dataAction); */
/* console.table(utentiInConference);
utentiInConference = userInConferenceVideo(idroom, idutente, dataAction);
console.table(utentiInConference); */
/* let utentiInConference: any[] = [];

function utentiConferenza(idutente: any, dataAction:any){
    
    // "idutente" vuole ENTRARE in conference
    if((idutente) && dataAction=='entrance'){
        //Verifica presenza in array "utentiInConference"
        let verificapsz: Boolean = utentiInConference.includes(idutente);
        if(verificapsz==true){
            // Utente già presente
        }
        else
        {
            // Utente NON presente.
            //Inserimento utente in array "utentiInConference".
            utentiInConference.push(idutente);
            //console.log(utentiInConference);
        }
    }

    // "idutente" vuole USCIRE dalla conference
    if((idutente) && dataAction=='exitUser'){
    
        //Ricerca posizione "idutente" in array "utentiInConference"
        let pos = utentiInConference.indexOf(idutente);
        
        //Se streamId è presente nell'array allora POSSIAMO effettivamente eliminarlo
        if(pos!=-1){
            //Eliminare "partecipante" dall'array
            utentiInConference.splice(pos, 1);
            //console.log(utentiInConference);
        }
        else
        {
            // Utente NON presente.
        }
    }

    return utentiInConference;

}

function idutente(urlrtmp: string){

    let rex: any = urlrtmp.split('/');
    let idutenteidentificato: any = rex[rex.length-1]

    return idutenteidentificato;
 
} */
//-----------------------------------------------------------------------------------------
//------------------------- Socket connection ---------------------------------------------
//-----------------------------------------------------------------------------------------
io.on('connection', function (socket) {
    socket.emit('message', { type: 'welcome', data: 'Hello from mediarecorder-to-rtmp server!' });
    socket.emit('message', { type: 'welcome', data: 'Please set rtmp destination before start streaming.' });
    let ffmpeg_process;
    let feedStream = false;
    socket.on('config_rtmpDestination', function (m) {
        if (typeof m != 'string') {
            socket.emit('message', { type: 'welcome', data: 'rtmp destination setup error.' });
            return;
        }
        var regexValidator = /^rtmp:\/\/[^\s]*$/; //TODO: should read config
        if (!regexValidator.test(m)) {
            //socket.emit('fatal','rtmp address rejected.');
            socket.emit('message', { type: 'fatal', data: 'rtmp address rejected.' });
            return;
        }
        socket._rtmpDestination = m;
        let dataforsocket = 'rtmp destination set to:' + m;
        socket.emit('message', { type: 'welcome', data: dataforsocket });
        //socket.emit('message', {type: 'userInConference', data: utentiConferenza(idutente(socket._rtmpDestination), 'entrance')});
        socket.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'entrance') });
        socket.broadcast.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'entrance') });
        console.log('9999:');
    });
    socket.on('config_vcodec', function (m) {
        console.log('8888:');
        if (typeof m != 'string') {
            //socket.emit('fatal','input codec setup error.');
            socket.emit('message', { type: 'fatal', data: 'input codec setup error.' });
            return;
        }
        if (!/^[0-9a-z]{2,}$/.test(m)) {
            //socket.emit('fatal','input codec contains illegal character?.');
            socket.emit('message', { type: 'fatal', data: 'input codec contains illegal character?.' });
            return;
        } //for safety
        socket._vcodec = m;
    });
    socket.on('start', function (m) {
        if (ffmpeg_process || feedStream) {
            console.log('7777:');
            //socket.emit('fatal','stream already started.');
            socket.emit('message', { type: 'fatal', data: 'stream already started.' });
            return;
        }
        if (!socket._rtmpDestination) {
            console.log('6666:');
            //socket.emit('fatal','no destination given.');
            socket.emit('message', { type: 'fatal', data: 'no destination given.' });
            return;
        }
        var framerate = socket.handshake.query.framespersecond;
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
        else if (framerate == 15) {
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
        console.log("ops", ops);
        console.log(socket._rtmpDestination);
        ffmpeg_process = child_process_1.spawn('ffmpeg', ops);
        console.log("ffmpeg spawned");
        feedStream = function (data) {
            ffmpeg_process.stdin.write(data);
            //write exception cannot be caught here.	
        };
        ffmpeg_process.stderr.on('data', function (d) {
            console.log('5555:');
            //socket.emit('ffmpeg_stderr','ffmpeg_stderr'+d);
            let ffmpeg_stderrforsocket = 'ffmpeg_stderr' + d;
            socket.emit('message', { type: 'info', data: ffmpeg_stderrforsocket });
        });
        ffmpeg_process.on('error', function (e) {
            console.log('child process error' + e);
            //socket.emit('fatal','ffmpeg error!'+e);
            let ffmpeg_error = 'ffmpeg error!' + e;
            socket.emit('message', { type: 'fatal', data: ffmpeg_error });
            feedStream = false;
            socket.disconnect();
        });
        ffmpeg_process.on('exit', function (e) {
            console.log('child process exit' + e);
            //socket.emit('fatal','ffmpeg exit!'+e);
            let ffmpeg_exit = 'ffmpeg exit!' + e;
            socket.emit('message', { type: 'fatal', data: ffmpeg_exit });
            socket.disconnect();
        });
    });
    //---------------------------- fine codice socket start --------------
    socket.on('binarystream', function (m) {
        console.log('44444:');
        if (!feedStream) {
            //socket.emit('fatal','rtmp not set yet.');
            socket.emit('message', { type: 'fatal', data: 'rtmp not set yet.' });
            ffmpeg_process.stdin.end();
            ffmpeg_process.kill('SIGINT');
            return;
        }
        feedStream(m);
    });
    socket.on('disconnect', function () {
        console.log("Browser closed --> streaming  disconnected!");
        feedStream = false;
        if (ffmpeg_process) {
            //socket.emit('message', {type: 'userInConference', data: utentiConferenza(idutente(socket._rtmpDestination), 'exitUser')});
            socket.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'exitUser') });
            socket.broadcast.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'exitUser') });
            ffmpeg_process.stdin.end();
            ffmpeg_process.kill('SIGINT');
            console.log("ffmpeg process ended!");
        }
        else {
            //socket.emit('message', {type: 'userInConference', data: utentiConferenza(idutente(socket._rtmpDestination), 'exitUser')});
            socket.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'exitUser') });
            socket.broadcast.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'exitUser') });
            console.warn('killing ffmoeg process attempt failed...');
        }
    });
    socket.on('disconnectStream', function () {
        console.log("Streaming  disconnected!");
        feedStream = false;
        if (ffmpeg_process) {
            //socket.emit('message', {type: 'userInConference', data: utentiConferenza(idutente(socket._rtmpDestination), 'exitUser')});
            socket.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'exitUser') });
            socket.broadcast.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'exitUser') });
            ffmpeg_process.stdin.end();
            ffmpeg_process.kill('SIGINT');
            console.log("ffmpeg process ended!");
        }
        else {
            //socket.emit('message', {type: 'userInConference', data: utentiConferenza(idutente(socket._rtmpDestination), 'exitUser')});
            socket.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'exitUser') });
            socket.broadcast.emit('message', { type: 'userInConference', data: userInConferenceVideo(idroomsplit(socket._rtmpDestination), idutentesplit(socket._rtmpDestination), 'exitUser') });
            console.warn('killing ffmoeg process attempt failed...');
        }
    });
    socket.on('error', function (e) {
        console.log('3333:');
        console.log('socket.io error:' + e);
    });
});
io.on('error', function (e) {
    console.log('222222:');
    console.log('socket.io error:' + e);
});
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
server.listen(port, function () {
    console.log(`https://www.collaudolive.com:${port}/`);
});
process.on('uncaughtException', function (err) {
    // handle the error safely
    console.log('11111:' + err);
    // Note: after client disconnect, the subprocess will cause an Error EPIPE, which can only be caught this way.
});
