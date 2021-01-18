const express = require('express');

const app = express();

app.use(express.json());

app.post('/test', (req, res) => {
    console.log('Request received.')
});

let server = app.listen(
    8080,
    '127.0.0.1',
    () => {
        let host = server.address().address;
        let port = server.address().port;

        console.log('Server listenting on ' + host + ':' + port);
    }
);