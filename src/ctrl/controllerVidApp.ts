exports.VidApp = (req: any, res: any, next: any) => { 

    console.log('ok vid app !!!');

    const { exec } = require("child_process");
 
    exec("sudo pm2 restart app", (error: any, stdout: any, stderr: any) => {
    
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
      } catch (error) {
        res.send('Errore: riavvio non effettuato');
      }  
  });

};