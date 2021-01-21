const fs = require('fs');
const express = require('express');
const config = require('../config.json');
const QueueUtil = require('./QueueUtil.js');

const app = express();
const QU = new QueueUtil();

app.use(express.json());

app.post('/test', async (req, res) => {
    console.log('Request received.');
    let data = JSON.stringify(req.body);

    // console.log('Payload: ' + data);
    fs.writeFileSync('test.json', data, (err) => {
        if (err) throw err;
        console.log('The file has been saved');
    });

    console.log('Sending response from webhook');
    res.status(200).send({resp:'Request processed'});

    console.log('Setup connection to RabbitMQ');

    let publisher = QU.getPublisher();
    publisher.then((channel) => {
        channel.assertQueue(config.queue, {durable:false});
        channel.sendToQueue(config.queue,Buffer.from(data));
        console.log('We aren\'t empty');
    });

});

const server = app.listen(
    8088,
    '127.0.0.1',
    () => {
        let host = server.address().address;
        let port = server.address().port;

        QU.startConsumerService();

        console.log('Server listenting on ' + host + ':' + port);
    }
);