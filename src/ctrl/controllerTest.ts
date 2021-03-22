exports.test = (req: any, res: any, next: any) => { 

    let par1 = req.params.par1; 
    let par2 = req.params.par2; 
    let partot = par1+par2;
    res.send(partot);

}