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
    logger.info(new StringBuilder('Request received.').toString());
    let data = JSON.stringify(req.body);

    fs.writeFileSync(config.test.filename, data, (err) => {
        if (err) throw err;
        logger.info(new StringBuilder('The file has been saved').toString());
    });

    logger.info(new StringBuilder('Sending response from webhook').toString());
    res.status(200).send({resp:'Request processed'});

    logger.info(new StringBuilder('Setup connection to RabbitMQ').toString());
    let publisher = QueueUtil.getPublisher();

    publisher.then((channel) => {
        logger.info(new StringBuilder('Assert queue exists.').toString());
        channel.assertQueue(config.queue, {durable:false});

        logger.info(new StringBuilder('Sending data to queue.').toString());
        channel.sendToQueue(config.queue,Buffer.from(data));

    }).catch((err) => {
        logger.info('ERROR',
            new StringBuilder()
                .append('Error occurred sending data to queue [')
                .append(config.queue)
                .append('] Error: ')
                .append(err)
                .toString()
        );
    });

});

const server = app.listen(
    8088,
    '127.0.0.1',
    () => {
        let host = server.address().address;
        let port = server.address().port;

        QueueUtil.startConsumerService();

        logger.info(
            new StringBuilder()
                .append('Server listenting on ')
                .append(host)
                .append(':')
                .append(port)
                .toString()
        );            
    }
);