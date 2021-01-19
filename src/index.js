const fs = require('fs');
const express = require('express');
const axios = require('axios');

const app = express();

app.use(express.json());

app.post('/queue', (req, res) => {
    console.log('New item for the queue.');
    let data = JSON.stringify(req.body);

    // console.log('Payload: ' + data);
    res.status(200).send({resp:'Queue request processed.'});
});

app.post('/test', (req, res) => {
    console.log('Request received.');
    let data = JSON.stringify(req.body);

    // console.log('Payload: ' + data);
    fs.writeFileSync('test.json', JSON.stringify(req.body), (err) => {
        if (err) throw err;
        console.log('The file has been saved');
    });

    console.log('Sending response from webhook');
    res.status(200).send({resp:'Request processed'});

    console.log('Formulate POST request');
    axios.post('http://localhost:8088/queue', data)
    .then((response) => {
        console.log(`statusCode ${response.status}`);
    })
    .catch((error) => {
        console.error(error);
    });

});

const server = app.listen(
    8088,
    '127.0.0.1',
    () => {
        let host = server.address().address;
        let port = server.address().port;

        console.log('Server listenting on ' + host + ':' + port);
    }
);
