
exports.test = (req: any, res: any, next: any) => { 

    const codcasutente = require('.././middleware/idCasUtenti');

    let codicecasualeutente = codcasutente.idCasUtenti(8)
    console.log("ciaoo: " + codicecasualeutente)

    

  
};


