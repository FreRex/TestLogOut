exports.VidApp = (req: any, res: any, next: any) => { 

    const { exec } = require("child_process");
 
    try {

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
           
        });

        res.json({
            "restartNMS": true
        });
      
    } catch (error) {
        res.json({
            "restartNMS": false
        });
     }  
  

};