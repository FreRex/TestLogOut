exports.VidApp = (req: any, res: any, next: any) => { 

    console.log('ok vid app');

    res.json({
        "a": 1,
        "b": "dd"
    });

/*
const { exec } = require("child_process");
 
  exec("pm2 restart app", (error: any, stdout: any, stderr: any) => {
    
      if (error) {
          console.log(`error: ${error.message}`);          
          return;
      }
      if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
      }
      
      console.log(`stdout: ${stdout}`);
         
  });

  */

};