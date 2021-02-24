# ChatOperativa - SmartCollaudo

Info progetto

## Primo accesso alla repository

```shell
# clona la repository
$ git clone https://github.com/tinatotty91/chat-operativa.git
# entra nella cartella del progetto
$ cd chat-operativa
# crea un branch locale "sviluppo"
chat-operativa> git checkout -b sviluppo
# aggiorna il progetto all'ultima versione disponibile
chat-operativa> git pull origin sviluppo
# installa i node_modules del progetto nodejs
chat-operativa> npm i
# entra nel progetto ionic/angular
chat-operativa> cd frontend
# installa  node_modules del progetto ionic/angular
chat-operativa\frontend> npm i
# serve l'app su http://localhost:8100
chat-operativa\frontend> ionic serve
# apre VSCode
chat-operativa\frontend> code .
```

## Project Settings

- **SDK**: *5.1 Lollipop (requested)* + 7.1.1 Nougat (optional) + 10.0 Q (optional)
- **NDK** (Side by side): *21.0.6113669*
- Android SDK Build-Tools: 30.0.0 or most recent
- Android SDK Platform-Tools: 30.0.3 or most recent
- Google USB Driver: 12 or most recent

## Sviluppi
12 febbraio 2021
Fino ad oggi implementati i seguenti punti:
- BACKEND: 
     * creata api statica in Php senza ssl;
     * creata api statica in Nodejs senza ssl;
     * creata api statica in Nodejs con ssl e posizionata in directory definitiva;
     * attivata api in pm2 in modo definitivo.
  
- FRONTEND: 
    * lettura e visualizzazione dati da api esterna;
    * Lettura e visualizzazione tutti dati da api esterna;
    * Lettura e visualizzazione parziale dei dati da api esterna;
    * Riordine directory applicazione.
    
23 febbraio 2021
BACKEND:
Impostato backend con frontend incluso.

24 febbraio 2021
BACKEND: 
Aggiunto in build/index.js: 
- parte path e __dirname;
- aggiunto http://localhost per test in locale.


## Endpoints

```xml
<!-- ESEMPIO -->
```
