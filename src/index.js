const fs = require('fs');
const express = require('express');
const config = require('../config.json');
const StringBuilder = require('node-stringbuilder');
const qUtil = require('./QueueUtil');
const Utils = require('./utils.js');

const app = express();
const logger = Utils.logger;
const QueueUtil = new qUtil({"logger":logger});

app.use(express.json());

app.post('/test', async (req, res) => {
    logger.info('Request received.');
    let data = JSON.stringify(req.body);

    fs.writeFileSync('test.json', data, (err) => {
        if (err) throw err;
        logger.info('The file has been saved');
    });

    logger.info('Sending response from webhook');
    res.status(200).send({resp:'Request processed'});

    logger.info('Setup connection to RabbitMQ');

    let publisher = QueueUtil.getPublisher();
    publisher.then((channel) => {
        channel.assertQueue(config.queue, {durable:false});
        channel.sendToQueue(config.queue,Buffer.from(data));
        logger.info('We aren\'t empty');
    }).catch((err) => {
        logger.info('ERROR',err);
    });

});

const server = app.listen(
    8088,
    '127.0.0.1',
    () => {
        let host = server.address().address;
        let port = server.address().port;

        QueueUtil.startConsumerService();

        let message = new StringBuilder()
            .append('Server listenting on ')
            .append(host)
            .append(':')
            .append(port)
            .toString(); 
        logger.info(message);            
    }
);