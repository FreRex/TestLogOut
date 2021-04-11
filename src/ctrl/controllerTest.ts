import { createSecretKey } from "node:crypto";

exports.test = (req: any, res: any, next: any) => { 


    let username = req.params.username;

    res.send(username);
  
};