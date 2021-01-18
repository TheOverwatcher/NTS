const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();

// const options = {
//     keys:fs.readFileSync('sslcert/'),
//     cert:fs.readFileSync('sslcert/')
// };

app.use(express.json());

app.post('/test', (req, res) => {
    console.log('Request received.');
    res.status(200).send('');
});

//let httpsServer = https.createServer();

const server = app.listen(
    8080,
    '127.0.0.1',
    () => {
        let host = server.address().address;
        let port = server.address().port;

        console.log('Server listenting on ' + host + ':' + port);
    }
);
