const https = require('https');

const data = JSON.stringify({
    table: 'multistreaming',
    id: '988',
    username: 'qwerty'
});

const options = {
    hostname: 'collaudolive.com:9083',
    port: '9083',
    path: '/u',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept-Charset': 'utf-8'
    }
};


const req = https.request(options, (res) => {
    let data = '';

    console.log('Status Code:', res.statusCode);

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('Body: ', JSON.parse(data));
    });

}).on("error", (err) => {
    console.log("Error: ", err.message);
});

req.write(data);
req.end();