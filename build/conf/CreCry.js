const CryptoJS = require("crypto-js");

/*
//Db Driver
const dbdriverciphertext = 'U2FsdGVkX19YNQPSxgwvdm15zkeq7/5ZyE8DfH8g54Y=';
const bytesdbdriver  = CryptoJS.AES.decrypt(dbdriverciphertext, 'Ke8u/*fe82jsk2UUqs2W');
const dbdriverDecryp = JSON.parse(bytesdbdriver.toString(CryptoJS.enc.Utf8));
exports.dbdriver = dbdriverDecryp;
*/

//Db Host
const dbhostciphertext = 'U2FsdGVkX1/C0SQr5N/Iz1k08R4EuEpiyynGd6hrTww=';
const bytesdbhost  = CryptoJS.AES.decrypt(dbhostciphertext, 'Ke8u/*fY66&jsk2UUqs2W');
const dbhostDecryp = bytesdbhost.toString(CryptoJS.enc.Utf8);
exports.dbhost = dbhostDecryp;

//Db Username
const dbusernameciphertext = 'U2FsdGVkX1/5vpnPZssh6hBUK/NojuvucRartdIvut0=';
const bytesdbusername  = CryptoJS.AES.decrypt(dbusernameciphertext, 'Ke8u/*fY66&//yoojsk2UUqs2W');
const dbusernameDecryp = bytesdbusername.toString(CryptoJS.enc.Utf8);
console.log(dbusernameDecryp);
exports.dbusername = dbusernameDecryp;

//Db Password
const dbpasswordciphertext = 'U2FsdGVkX18V+P/XMCSTXIFKqin2Of/RhvGFYDmaqGE=';
const bytesdbpassword  = CryptoJS.AES.decrypt(dbpasswordciphertext, 'Ke8u/*fY66&//yoo1js&%s)Iqs2W');
const dbpasswordDecryp = bytesdbpassword.toString(CryptoJS.enc.Utf8);
exports.dbpassword = dbpasswordDecryp;

//Db Name
const dbnameciphertext = 'U2FsdGVkX18jpCFxBbHaNJMMvuvo8xHjOaGskGySz9w=';
const bytesdbname  = CryptoJS.AES.decrypt(dbnameciphertext, 'Ke8u/*fY66&Y/yoo£eE2W');
const dbnameDecryp = bytesdbname.toString(CryptoJS.enc.Utf8);
exports.db = dbnameDecryp;

