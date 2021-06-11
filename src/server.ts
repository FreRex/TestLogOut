import express from 'express';
import path from 'path';
import https from 'https';
import fs from 'fs';
import { spawn } from 'child_process';

const routes = require('./routes');
const functionListaConference = require('./assets/functionListaConference');

const app = express();

let port: any;
if (process.env.NODE_ENV == 'production') {
  require('dotenv').config();
  port = process.env.PORT_PROD || 9666;
}
else
{
  port = 9187;
}

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

const server: any = require('https').createServer( 
	{
		key: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/privkey.pem'),
    	cert: fs.readFileSync('/etc/letsencrypt/live/www.collaudolive.com/cert.pem')
	},
app);

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

spawn('ffmpeg',['-h']).on('error',function(m:any){	
	console.error("FFMpeg not found in system cli; please install ffmpeg properly or make a softlink to ./!");
	process.exit(-1);
});





//---------------------------------------------------------------
//---------------------------------------------------------------
// --- Sezione per presenza utenti in conference
//---------------------------------------------------------------
//---------------------------------------------------------------

/*

let utentiInConference: any[] = [];

//--------------------------------------- FUNZIONI PER ARRAY MULTIDIMENSIONALE ---------------------------------------------

//-------------------- SPLIT RTMP -----------------------------------

function idutentesplit(urlrtmp: string){
	let idutenteinside = urlrtmp.split('/');
	let idutenteidentificato = idutenteinside[idutenteinside.length-1]
	return idutenteidentificato; 
}

function idroomsplit(urlrtmp: string){
	let idroominside = urlrtmp.split('/');
	let idroomidentificata = idroominside[idroominside.length-2]
	return idroomidentificata; 
}

//-------------- Funzioni di ricerca -------------------------------
function checkPresenzaIdRoom(idroom: number){    
    let checkPresenzaFinaleIdRoom = -1;   
    for (let index = 0; index < utentiInConference.length; index++) {
        if(utentiInConference[index].includes(idroom)){            
            checkPresenzaFinaleIdRoom = index;            
        }          
    }    
    return checkPresenzaFinaleIdRoom;
}

function checkPresenzaIdUtente(idroom: number, idutente : string){   
    let checkPresenzaFinaleIdUtente = -1;
    let index = checkPresenzaIdRoom(idroom);   
     
    if(utentiInConference[index].includes(idutente)>=0){
        //checkPresenzaFinaleIdUtente = index;
        checkPresenzaFinaleIdUtente = utentiInConference[index].indexOf(idutente);
    } 
   
    return checkPresenzaFinaleIdUtente;
}

function checkPresenzaSocketid(socketid: string){    
    let checkPresenzaFinaleSocketid: any= -1;	
    for (let y = 0; y < utentiInConference.length; y++) {        
        for (let x = 0; x < utentiInConference[y].length; x++) {           	
            if(utentiInConference[y][x].socketid==socketid){                        
               checkPresenzaFinaleSocketid = {x,y}; 
               console.log('Socketid X e Y: ' + x + '-' + y);       
            }  
        }        
    }    
    return checkPresenzaFinaleSocketid;
}

//----------------------------- INSERIMENTO ELEMENTO ------------------------------------------

function insertArray(idroom: number, idutente: string, socketid: string){
   
	let elemento: any = '';

    // INSERIRE ROOM ED UTENTE
    if(checkPresenzaIdRoom(idroom)==-1){
        console.log("idroom NON PRESENTE e di conseguenza NON presente anche l'idutente => bisogna inserirli entrambi nell'array !");
        //idroom NON PRESENTE e di conseguenza NON presente anche l'idutente => bisogna inserirli entrambi nell'array !  
		 //elemento = {'idutente': idutente, 'socketid': socketid, 'stream': false};  
		elemento = {idutente: `${idutente}`, socketid: `${socketid}`, stream: false};
        utentiInConference.push([Number(idroom), elemento]);		
    }
	// INSERIRE UTENTE 
	else if(checkPresenzaIdRoom(idroom)>=0 && checkPresenzaIdUtente(idroom, idutente)==-1){       
		//UTENTE NON PRESENTE --> INSERIRE UTENTE NELL'ARRAY !          
       console.log("Utente NON presente inserire utente nell'ARRAY"); 
	   elemento = {idutente: `${idutente}`, socketid: `${socketid}`, stream: false};                     
       utentiInConference[checkPresenzaIdRoom(idroom)].push(elemento);	   
    }   
    
	let userInConferenceVideo = utentiInConference;
    return userInConferenceVideo;
}

//----------------------------- ELIMINAZIONE ELEMENTO

function deleteRow(arr: any, row: any) {     
    arr = arr.slice(0); // make copy
    arr.splice(row - 1, 1);
    return arr;
 }


function deleteUser(socketid: string){
    
    let userInConferenceVideo = utentiInConference
    let socketidCoo=checkPresenzaSocketid(socketid);
    
    console.log('Index room del socketid: ' + socketidCoo);    
    console.log("Eliminare partecipante dall'array");

    //Eliminazione oggetto 
    let el = utentiInConference[socketidCoo.y].splice(socketidCoo.x,1);    
    
    if(utentiInConference[socketidCoo.y].length==1){   
        console.log("Eliminazione Room")     
        userInConferenceVideo=deleteRow(utentiInConference,socketidCoo.y+1);
    }
  
    return userInConferenceVideo; 
}
//-----------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

//-------------------------------------------------------

function userInConferenceVideo(idroom: number, idutente: string, dataAction: string, socketid: string){    
    
    let userInConferenceVideo=utentiInConference;
    
    switch (dataAction) {
        case 'entrance':
            //INSERIRE UTENTE E/O ROOM
            console.table(insertArray(idroom, idutente, socketid));           
        break;

        case 'exitUser':
            //ELIMINARE UTENTE e/o ROOM            
			userInConferenceVideo = deleteUser(socketid);
			console.table(userInConferenceVideo);
        break;        
    
        default:
        break;
    }

    return userInConferenceVideo;
}
 */
//_______________________________________________________________________________________________________________________
//_______________________________________________________________________________________________________________________
//_______________________________________________________________________________________________________________________


//-----------------------------------------------------------------------------------------
//------------------------- Socket connection ---------------------------------------------
//-----------------------------------------------------------------------------------------

// Connessione socket.io
io.on('connection', function(socket: any){

	console.log('socket.id: ' + socket.id)

	socket.emit('message',{type: 'welcome', data: 'Hello from mediarecorder-to-rtmp server!'});	
	socket.emit('message',{type: 'welcome', data: 'Please set rtmp destination before start streaming.'});

	let ffmpeg_process: any;
	let feedStream: any = false;

	// Ricezione tramite socket url_rtmp, socket.id e relativa elaborazione
	socket.on('config_rtmpDestination',function(m: any){

		console.log("ddddddddddd: " +m)

		//Verifica errori in url_rtmp
		if(typeof m != 'string'){			
			socket.emit('message',{type: 'welcome', data: 'rtmp destination setup error.'});
			return;
		}
		var regexValidator=/^rtmp:\/\/[^\s]*$/;//TODO: should read config
		if(!regexValidator.test(m)){
			//socket.emit('fatal','rtmp address rejected.');
			socket.emit('message',{type: 'fatal', data: 'rtmp address rejected.'});
			return;
		}
		//--------------------------

		let socketid: any=socket.id;
		socket._rtmpDestination=m;		
		let dataforsocket: string='rtmp destination set to:'+m;

		console.log(socket._rtmpDestination);
		//Inserimento in array dati nuovo utente in conference

		let insertArray: any = functionListaConference.userInConferenceVideo(Number(functionListaConference.idroomsplit(socket._rtmpDestination)), functionListaConference.idutentesplit(socket._rtmpDestination), 'entrance', socketid )
		
		//Invio messaggi di benvenuto 
		//invio lista utenti presenti in conference
	
		socket.emit('message',{type: 'welcome', data: dataforsocket});		
		socket.emit('message', {type: 'userInConference', data: insertArray});		
		socket.broadcast.emit('message', {type: 'userInConference', data: insertArray});
	
	}); 
	
	//Configurazione codec
	socket.on('config_vcodec',function(m: any){
		
		//Verifica errori in codev
		if(typeof m != 'string'){			
			socket.emit('message',{type: 'fatal', data: 'input codec setup error.'});
			return;
		}
		if(!/^[0-9a-z]{2,}$/.test(m)){			
			socket.emit('message',{type: 'fatal', data: 'input codec contains illegal character?.'});
			return;
		}//for safety
		//-----------------------
		socket._vcodec=m;

	});

	//Ricezione tramite socket.on segnale avvio streaming
	socket.on('start',function(m: any){
		
		//Verifica errori 
			//- verifica che streaming sia già attivo 
		if(ffmpeg_process || feedStream){			
			socket.emit('message',{type: 'fatal', data: 'stream already started.'});
			return;
		}
			//- verifica che non sia presente una url_rtmp
		if(!socket._rtmpDestination){			
			socket.emit('message',{type: 'fatal', data: 'no destination given.'});
			return;
		}
		
		//Impostazioni parametri per audio streaming
		var audioBitrate = parseInt(socket.handshake.query.audioBitrate);
	    var audioEncoding = "64k";
		if (audioBitrate ==11025){
			audioEncoding = "11k";
		} else if (audioBitrate ==22050){
			audioEncoding = "22k";
		} else if (audioBitrate ==44100){
			audioEncoding = "44k";
		}
		console.log(audioEncoding, audioBitrate);

		//Impostazioni parametri per video streaming
		var framerate = socket.handshake.query.framespersecond;
		console.log('framerate on node side', framerate);
		//var ops = [];
		if (framerate == 1){
			var ops = [
				'-i','-',
				 '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency', 
				//'-max_muxing_queue_size', '1000', 
				//'-bufsize', '5000',
			       '-r', '1', '-g', '2', '-keyint_min','2', 
					'-x264opts', 'keyint=2', '-crf', '25', '-pix_fmt', 'yuv420p',
			        '-profile:v', 'baseline', '-level', '3', 
     				'-c:a', 'aac', '-b:a', audioEncoding, '-ar', audioBitrate, 
			        '-f', 'flv', socket._rtmpDestination		
			];
			
		}else if (framerate == 15){
			var ops = [
				'-i','-',
				 '-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency', 
				'-max_muxing_queue_size', '1000', 
				'-bufsize', '5000',
			       '-r', '15', '-g', '30', '-keyint_min','30', 
					'-x264opts', 'keyint=30', '-crf', '25', '-pix_fmt', 'yuv420p',
			        '-profile:v', 'baseline', '-level', '3', 
     				'-c:a', 'aac', '-b:a',audioEncoding, '-ar', audioBitrate, 
			        '-f', 'flv', socket._rtmpDestination		
			];
			
			}else{
		   		var ops=[
			 	'-i','-',
				//'-c', 'copy', 
				'-c:v', 'libx264', '-preset', 'ultrafast', '-tune', 'zerolatency',  // video codec config: low latency, adaptive bitrate
				'-c:a', 'aac', '-ar', audioBitrate, '-b:a', audioEncoding, // audio codec config: sampling frequency (11025, 22050, 44100), bitrate 64 kbits
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
	
			ffmpeg_process=spawn('ffmpeg', ops);
			console.log("ffmpeg spawned");

			feedStream=function(data: any){	
			ffmpeg_process.stdin.write(data);
			//write exception cannot be caught here.	
		}

		ffmpeg_process.stderr.on('data',function(d: any){			
			let ffmpeg_stderrforsocket = 'ffmpeg_stderr'+d;
			socket.emit('message',{type: 'info', data: ffmpeg_stderrforsocket});
		});
	
		ffmpeg_process.on('error',function(e: any){
			console.log('child process error'+e);
			let ffmpeg_error = 'ffmpeg error!'+e;
			socket.emit('message',{type: 'fatal', data: ffmpeg_error});
			feedStream=false;
			socket.disconnect();
		});
	
		ffmpeg_process.on('exit',function(e: any){
			console.log('child process exit'+e);
			//socket.emit('fatal','ffmpeg exit!'+e);
			let ffmpeg_exit = 'ffmpeg exit!'+e;
			socket.emit('message',{type: 'fatal', data: ffmpeg_exit});
			socket.disconnect();
		});
	});

	//---------------------------- fine codice socket start --------------

	socket.on('binarystream',function(m: any){		
		if(!feedStream){			
			socket.emit('message',{type: 'fatal', data: 'rtmp not set yet.'});
			ffmpeg_process.stdin.end();
			ffmpeg_process.kill('SIGINT');
			return;
		}
		feedStream(m);
	});

	//Ricezione segnale di disconnessione per chiusura browser.
	socket.on('disconnect', function(m: any) {		

		let socketid: any=socket.id;
		let idroom: any=m;
		feedStream=false;	
		
		console.log("Browser closed --> streaming  disconnected ! " + socketid);

		//Eliminazione utente in conference
		let insertArray: any = functionListaConference.userInConferenceVideo(idroom, functionListaConference.idutentesplit(socket._rtmpDestination), 'exitUser', socketid);	
			
		if(ffmpeg_process){
            
			//Eliminazione utente in conference
			//let insertArray: any = functionListaConference.userInConferenceVideo(idroom, functionListaConference.idutentesplit(socket._rtmpDestination), 'exitUser', socketid);	
			
			
			//invio lista utenti presenti in conference

			socket.emit('message', {type: 'userInConference', data: insertArray});		   
			socket.broadcast.emit('message', {type: 'userInConference', data: insertArray});		
			
			ffmpeg_process.stdin.end();
			ffmpeg_process.kill('SIGINT');

			console.log("ffmpeg process ended!");
		}
		else
		{
			//Eliminazione utente in conference

			//let insertArray: any = functionListaConference.userInConferenceVideo(idroom, functionListaConference.idutentesplit(socket._rtmpDestination), 'exitUser', socketid);	
				
			
			//invio lista utenti presenti in conference

			socket.emit('message', {type: 'userInConference', data: insertArray});		   
			socket.broadcast.emit('message', {type: 'userInConference', data: insertArray});	

			console.warn('killing ffmpeg process attempt failed...');
		}
	});

	/* //Ricezione segnale di disconnessione streaming per pulsante stop.
	socket.on('disconnectStream', function (idroom: any) {
		
		let socketid: any=socket.id;
		console.log("Streaming  disconnected ! " + socketid);
		feedStream=false;
		if(ffmpeg_process){
			
			//Eliminazione utente in conference
			let insertArray: any = userInConferenceVideo(idroom, idutentesplit(socket._rtmpDestination), 'exitUser', socketid);	
			
			//invio lista utenti presenti in conference

			socket.emit('message', {type: 'userInConference', data: insertArray});		   
			socket.broadcast.emit('message', {type: 'userInConference', data: insertArray});	

			ffmpeg_process.stdin.end();
			ffmpeg_process.kill('SIGINT');
			console.log("ffmpeg process ended!");
		}
		else
		{
			
			//Eliminazione utente in conference
			let insertArray: any = userInConferenceVideo(idroom, idutentesplit(socket._rtmpDestination), 'exitUser', socketid);	
			
			//invio lista utenti presenti in conference

			socket.emit('message', {type: 'userInConference', data: insertArray});		   
			socket.broadcast.emit('message', {type: 'userInConference', data: insertArray});
			
			console.warn('killing ffmoeg process attempt failed...');
		}
	}); */

	socket.on('error',function(e: any){		
		console.log('socket.io error:'+e);
	});
	

});

io.on('error',function(e: any){	
	console.log('socket.io error:'+e);
});

//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------


server.listen(port, function(){  
  console.log(`https://www.collaudolive.com:${port}/`);
});

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log('Errore:' + err);
    // Note: after client disconnect, the subprocess will cause an Error EPIPE, which can only be caught this way.
})