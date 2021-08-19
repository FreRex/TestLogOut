exports.insertPhotoDir = (folderName: string, imageName: string, base64String: string) => { 
  
    const fs = require('fs');    
    try {
        //Verifica presenza cartella
        if (!fs.existsSync('frontend/datasave/' + folderName)) {
            fs.mkdirSync('frontend/datasave/' + folderName)
            console.log('Cartella creata !');            
        }
        else
        {
            console.log('cartella già presente')
        }
  
        // Remove header
        let base64Image = base64String.split(';base64,').pop();       
        if (!fs.existsSync('frontend/datasave/' + folderName +'/'+imageName)) {
            //Salvataggio foto in cartella specifica
            fs.writeFile('frontend/datasave/' + folderName+'/'+imageName, base64Image, {encoding: 'base64'}, function(err: any) {
                console.log('File created');
            });
            
        }
        else
        {
        console.log('foto già presente !');
        }
    
    } catch (err) {
        console.error(err)
    }   

}