# ChatOperativa - SmartCollaudo

Info progetto

## Primo accesso alla repository

```shell
# clona la repository
git clone https://github.com/tinatotty91/chat-operativa.git

# crea un branch locale "sviluppo" e aggiorna il progetto
git checkout -b sviluppo
git pull origin sviluppo

# entra nella cartella creata
cd chat-operativa

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

## Project Settings

- **Versione Node**: *...*
- **Versione Angular**: *...*
- **Versione Ionic**: *...*

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
