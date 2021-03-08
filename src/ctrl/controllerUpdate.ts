exports.putUpdate = (req: any, res: any, next: any) => {   

    //Bisognerebbe anche verificare se esiste un record per l'id
   
    const id = req.body.id;
    const table = req.body.table;
    const username = req.body.username;       
        
    res.json(username);
    
};