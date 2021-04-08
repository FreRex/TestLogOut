exports.test = (req: any, res: any, next: any) => { 

    const execuDb = require('../middleware/execuDb');

    const username = 'admin';
    const password = 'Bambini';

    let query ='SELECT id FROM utenti WHERE username = '+ username +' AND password = '+ password;  

    res.send("wwwwwwwwww")

    //execuDb.getSelect(query);



}