"use strict";
let utentiInConference = [];
//--------------------------------------- FUNZIONI PER ARRAY MULTIDIMENSIONALE ---------------------------------------------
//-------------------- SPLIT RTMP -----------------------------------
let idutentesplit = function (urlrtmp) {
    let idutenteinside = urlrtmp.split('/');
    let idutenteidentificato = idutenteinside[idutenteinside.length - 1];
    return idutenteidentificato;
};
let idroomsplit = function (urlrtmp) {
    let idroominside = urlrtmp.split('/');
    let idroomidentificata = idroominside[idroominside.length - 2];
    return idroomidentificata;
};
//-------------- Funzioni di ricerca -------------------------------
let checkPresenzaIdRoom = function (idroom) {
    let checkPresenzaFinaleIdRoom = -1;
    for (let index = 0; index < utentiInConference.length; index++) {
        if (utentiInConference[index].includes(idroom)) {
            checkPresenzaFinaleIdRoom = index;
        }
    }
    return checkPresenzaFinaleIdRoom;
};
let checkPresenzaIdUtente = function (idroom, idutente) {
    let checkPresenzaFinaleIdUtente = -1;
    let index = checkPresenzaIdRoom(idroom);
    if (utentiInConference[index].includes(idutente) >= 0) {
        //checkPresenzaFinaleIdUtente = index;
        checkPresenzaFinaleIdUtente = utentiInConference[index].indexOf(idutente);
    }
    return checkPresenzaFinaleIdUtente;
};
let checkPresenzaSocketid = function (socketid) {
    let checkPresenzaFinaleSocketid = -1;
    for (let y = 0; y < utentiInConference.length; y++) {
        for (let x = 0; x < utentiInConference[y].length; x++) {
            if (utentiInConference[y][x].socketid == socketid) {
                checkPresenzaFinaleSocketid = { x, y };
                console.log('Socketid X e Y: ' + x + '-' + y);
            }
        }
    }
    return checkPresenzaFinaleSocketid;
};
//----------------------------- INSERIMENTO ELEMENTO IN MATRICE MULTIDIMENSIONALE ------------------------------------------
let insertArray = function (idroom, idutente, socketid) {
    let elemento = '';
    // INSERIRE ROOM ED UTENTE
    if (checkPresenzaIdRoom(idroom) == -1) {
        console.log("idroom NON PRESENTE e di conseguenza NON presente anche l'idutente => bisogna inserirli entrambi nell'array !");
        //idroom NON PRESENTE e di conseguenza NON presente anche l'idutente => bisogna inserirli entrambi nell'array !  
        //elemento = {'idutente': idutente, 'socketid': socketid, 'stream': false};  
        elemento = { idutente: `${idutente}`, socketid: `${socketid}`, stream: false };
        utentiInConference.push([Number(idroom), elemento]);
    }
    // INSERIRE UTENTE 
    else if (checkPresenzaIdRoom(idroom) >= 0 && checkPresenzaIdUtente(idroom, idutente) == -1) {
        //UTENTE NON PRESENTE --> INSERIRE UTENTE NELL'ARRAY !          
        console.log("Utente NON presente inserire utente nell'ARRAY");
        elemento = { idutente: `${idutente}`, socketid: `${socketid}`, stream: false };
        utentiInConference[checkPresenzaIdRoom(idroom)].push(elemento);
    }
    let userInConferenceVideo = utentiInConference;
    return userInConferenceVideo;
};
//----------------------------- ELIMINAZIONE ELEMENTO
let deleteRow = function (arr, row) {
    arr = arr.slice(0); // make copy
    arr.splice(row - 1, 1);
    return arr;
};
let deleteUser = function (socketid) {
    let userInConferenceVideo = utentiInConference;
    let socketidCoo = checkPresenzaSocketid(socketid);
    console.log('Index room del socketid: ' + socketidCoo);
    console.log("Eliminare partecipante dall'array");
    //Eliminazione oggetto 
    let el = utentiInConference[socketidCoo.y].splice(socketidCoo.x, 1);
    //Verificare se la room è vuota e nel caso eliminarla
    if (utentiInConference[socketidCoo.y].length == 1) {
        console.log("Eliminazione Room");
        userInConferenceVideo = deleteRow(utentiInConference, socketidCoo.y + 1);
    }
    else {
        //La room non è vuota e si seleziona l'array monodimensionale specifico della stanza
        userInConferenceVideo = utentiInConference[socketidCoo.y];
    }
    return userInConferenceVideo;
};
//-----------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
//-------------------------------------------------------
let userInConferenceVideo = function (idroom, idutente, dataAction, socketid) {
    let userInConferenceVideo = utentiInConference;
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
};
module.exports = {
    userInConferenceVideo,
    idutentesplit,
    idroomsplit,
    checkPresenzaIdRoom,
    checkPresenzaIdUtente,
    checkPresenzaSocketid,
    insertArray,
    deleteRow,
    deleteUser,
    utentiInConference
};
