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
    console.log('Payload: ' + JSON.stringify(req.body));
    fs.writeFileSync('test.json', JSON.stringify(req.body), (err) => {
        if (err) throw err;
        console.log('The file has been saved');
    });
    res.status(200).send({resp:'Request processed'});
});

//let httpsServer = https.createServer();

const server = app.listen(
    8088,
    '127.0.0.1',
    () => {
        let host = server.address().address;
        let port = server.address().port;

        console.log('Server listenting on ' + host + ':' + port);
    }
);
