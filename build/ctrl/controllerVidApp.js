"use strict";
exports.VidApp = (req, res, next) => {
    console.log('ok vid app !!!');
    const { exec } = require("child_process");
    exec("sudo pm2 restart app", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stdout) {
            console.log(`stdout: ${stdout}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        try {
            res.send('riavvio effettuato');
        }
        catch (error) {
            res.send('Errore: riavvio non effettuato');
        }
    });
};
