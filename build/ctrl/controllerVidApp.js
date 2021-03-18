"use strict";
exports.VidApp = (req, res, next) => {
    const { exec } = require("child_process");
    try {
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
        });
        res.json({
            "restartNMS": true
        });
    }
    catch (error) {
        res.json({
            "restartNMS": false
        });
    }
};
