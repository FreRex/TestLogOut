exports.getTokenClose = (req: any, res: any, next: any) => { 

    const util = require('util');
    const db = require('../conf/db');

    //Esempio
    //const username = '110';
    //const password = '110';

    // Request
    //let username = req.body.username;
    //let password = req.body.password;
    let username = req.params.username;
    let password = req.params.password;   

    console.log(username);
    console.log(password);

    // node native promisify
    const query = util.promisify(db.query).bind(db);

    

    (async () => {   
        
        const rows = await query("SELECT id FROM utenti WHERE username = '" + username + "' and password = '" + password + "'");

        try {         
            let idutente = rows[0].id;
            const jwt = require('.././middleware/jwt');    
            let token: any = jwt.setToken(idutente);
            let payload = jwt.getPayload(token);            
            res.json(
              {
                token: token,
                //payload: payload
              }
            );  
            
        } catch (error) {
            console.log('errore procedura token')
            res.sendStatus(401);
        }

    })()    

};


exports.getToken = (req: any, res: any, next: any) => { 

  const jwt = require('.././middleware/jwt');    
    
    let token: any = jwt.setToken("sviluppo");
    let payload = jwt.getPayload(token);
    
    res.json(
        {
            token: token,
            payload: payload
        }
    );   

};