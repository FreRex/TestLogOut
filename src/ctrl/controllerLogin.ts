exports.checkLogin = (req: any, res: any, next: any) => {  
   
    let pkproject: number;
    if(!req.body.pkproject){
      pkproject=0;
    }
    else
    {
      pkproject = req.body.pkproject;
    }    

    let usr = req.body.usr;
    let pwd = req.body.pwd;
    let select: string;
    let datiDb: any;
        
    const db = require('../conf/db'); 

    if(pkproject==0){
      select = "SELECT utenti.id AS idutente, utenti.idcommessa AS idcommessa, commesse.denominazione AS commessanome, utenti.autorizzazioni AS autorizzazione, utenti.idutcas AS idutcas, utenti.collaudatoreufficio AS nomecognome ";
      select = select + "FROM utenti "
      select = select + "INNER JOIN commesse ON commesse.id = utenti.idcommessa "
      select = select + "WHERE username = ? AND password = ?"     
      datiDb = [usr, pwd];      
    }
    else
    {
      select = "SELECT utenti.id AS idutente, utenti.idcommessa AS idcommessa, utenti.autorizzazioni AS autorizzazione, utenti.username, utenti.password, multistreaming.collaudatoreufficio, multistreaming.cod, utenti.idutcas AS idutcas, utenti.collaudatoreufficio AS nomecognome, commesse.denominazione AS commessanome, commesse.id FROM utenti INNER JOIN multistreaming ON multistreaming.collaudatoreufficio = utenti.id INNER JOIN commesse ON commesse.id = utenti.idcommessa WHERE utenti.username = ? AND utenti.password = ? AND multistreaming.cod = ?";
      datiDb = [usr, pwd, pkproject];      
    }    
    
    db.query(select, datiDb, function (err: any, result: any, fields: any) {        
        if(result.length >= 1){                  
                   
          const jwt = require('.././middleware/jwt'); 
          let token: any = jwt.setToken(usr,pwd,result[0]['idutente'],result[0]['idcommessa'],result[0]['autorizzazione'],result[0]['idutcas'],result[0]['nomecognome'],result[0]['commessanome'],);
          let payload = jwt.getPayload(token);          
          if(pkproject==0){
            res.json(
              {
                token: token
              }
            );
          }
          else
          {
            res.json(
              {
                token: token,                
                pkproject: pkproject
              }
            );
          }

        }
        else
        {
          console.log('Credenziali NON presenti o NON corrette.');         
          res.json(false);
        }        
        
    });    

}

exports.decodeToken = (req: any, res: any, next: any) => { 

  const jwt = require('.././middleware/jwt'); 
  
  let token = req.body.token;
  
  let payload = jwt.getPayload(token);
  
  res.json(
      {
          token: token,
          payload: payload
      }
  );

}


exports.checkUserMobile = (req: any, res: any, next: any) => { 
  
  const db = require('../conf/db'); 

  if (typeof(req.body.usermobile) !== 'undefined' && (req.body.usermobile)!= 0 && (req.body.usermobile)!='') {
    let usermobile = req.body.usermobile;
    let sql: string = "SELECT usermobile FROM multistreaming WHERE usermobile = ?";
    let datiDb: any = [usermobile];
    esecuzioneQuery(sql,datiDb);  
  }
  else
  {
    //Parametro usermobile errato
    res.json(false);
  } 

  //-------------------
  // Esecuzione query
  //-------------------   
  function esecuzioneQuery(sql: any, datiDb: any){    
    db.query(sql, [datiDb], (err: any, rows: any, fields: any) => {
        if(err || rows.length == 0){
            //Parametro usermobile non presente 
            res.json(false);
        }else{                       
            res.json(true);
        }
    });
  }
  

}