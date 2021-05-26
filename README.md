# ChatOperativa - SmartCollaudo

Info progetto

## Primo accesso alla repository

```shell
# clona la repository
git clone https://github.com/tinatotty91/chat-operativa.git

# entra nella cartella creata
cd chat-operativa

# crea un branch locale "sviluppo" e aggiorna il progetto
git checkout -b sviluppo
git pull origin sviluppo

# DENTRO CHAT-OPERATIVA: installa i node_modules del backend
npm i

# entra nella cartella frontend
cd frontend

# DENTRO FRONTEND: installa node_modules del frontend
npm i

# apri VSCode
code .

# Se non ci sono errori, servi l'app del frontend
ionic serve
```

## Streaming RTMP Node.js/Angular

### Librerie npm interessanti:

- [node-media-server](https://www.npmjs.com/package/node-media-server): libreria base per pubblicare uno stream
  - https://github.com/dougsillars/browserLiveStream
  - https://www.fatalerrors.org/a/0t590jE.html
- [video.js](https://www.npmjs.com/package/video.js): video player HTML5 open source
  - https://opensource.com/article/20/2/video-streaming-tools
  - https://docs.videojs.com/tutorial-angular.html
- [socket.io](https://www.npmjs.com/package/socket.io): libreria base per connessione socket
  - https://www.digitalocean.com/community/tutorials/angular-socket-io
  - https://javascript-conference.com/blog/real-time-in-angular-a-journey-into-websocket-and-rxjs/
  - https://blog.briebug.com/blog/making-use-of-websockets-in-angular
- [ngx-webcam](https://www.npmjs.com/package/ngx-webcam): forse interessante ma WebRTC
- [node-rtsp-stream](https://www.npmjs.com/package/node-rtsp-stream): forse interessante ma RTSP

### Altri spunti:

- https://community.api.video/t/integration-with-ioni/2154/7
- https://stackoverflow.com/questions/58899464/not-able-to-show-live-camera-rtsp-streaming-with-angular
- https://stackoverflow.com/questions/56439937/how-to-stream-rtmp-in-angular-6-or-in-html-5
- https://stackoverflow.com/questions/46625044/how-to-stream-a-m4v-video-with-nodejs

## Configurazione Prettier

Sulla progetto chat-operativa ho installato [prettier](https://prettier.io/docs/en/configuration.html), un formattatore automatico, e ho configurato [husky](https://typicode.github.io/husky/#/?id=create-a-hook) insieme a [pretty-quick](https://github.com/azz/pretty-quick) per formattare in automatico i file prima di ogni commit: husky crea un hook prima di ogni commit; pretty-quick formatta in automatico tutti i file aggiunti al commit.

Ci sono 3 nuove dipendenze (la prima volta andranno installate con "_npm i_"), 3 nuovi script sul package.json e una nuova cartella _.husky_ con dei file di configurazione.

Il file di configurazione di Prettier invece è dentro al frontend: _.prettierrc_.
Tutte le operazioni di formattazione intervengono solo sul frontend e non modificano in alcun modo il backend (@Frex interessa?). Installando l'estensione [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) il codice verrà formattato secondo le regole impostate sul file di configurazione generale (Settings -> Text Editor -> **Default Formatter: Prettier** + **Format On Save**).

Le guide che ho seguito:

- https://dandawsonbrown.com/blog/setup-prettier-in-an-angular-cli-project/
- https://levelup.gitconnected.com/setup-prettier-on-angular-in-30-minutes-12b2ed85e7b7

```javascript
# package.json

"devDependencies": {
    "husky": "^6.0.0",
    "prettier": "^2.3.0",
    "pretty-quick": "^3.1.0",
  },
"scripts": {
  "p:quick": "pretty-quick",
  "p:check": "prettier --config ./frontend/.prettierrc --check \"frontend/src/{app,environments}/**/*{.ts,.js,.json,.html,.css,.scss,.md}\"",
  "p:format": "prettier --config ./frontend/.prettierrc --write \"frontend/src/{app,environments}/**/*{.ts,.js,.json,.html,.css,.scss,.md}\"",
},
```

## Project Settings

- **Versione Node**: _..._
- **Versione Angular**: _..._
- **Versione Ionic**: _..._

## Sviluppi

12 febbraio 2021
Fino ad oggi implementati i seguenti punti:

- BACKEND:
  - creata api statica in Php senza ssl;
  - creata api statica in Nodejs senza ssl;
  - creata api statica in Nodejs con ssl e posizionata in directory definitiva;
  - attivata api in pm2 in modo definitivo.
- FRONTEND:
  - lettura e visualizzazione dati da api esterna;
  - Lettura e visualizzazione tutti dati da api esterna;
  - Lettura e visualizzazione parziale dei dati da api esterna;
  - Riordine directory applicazione.

23 febbraio 2021
BACKEND:
Impostato backend con frontend incluso.

24 febbraio 2021
BACKEND:
Aggiunto in build/server.js:

- parte path e \_\_dirname;
- aggiunto http://localhost per test in locale.

## Endpoints

```xml
<!-- ESEMPIO -->
```
