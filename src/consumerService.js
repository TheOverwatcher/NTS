
const amqp = require('amqplib/callback_api');
const config = require('../config.json')
const Utils = require('./utils');

module.exports = class ConsumerService {
    constructor(args) {
        this.logger = args.logger;
    }

    start() {
        for(let i = 0; i < config.consumer.workerCount; i++) {
            this.startConsumer({name: 'Consumer' + i});
        }
    }

    startConsumer(params) {
        try {
            amqp.connect('amqp://localhost', (error0, connection) => {
                if(error0) {
                    throw error0;
                }
    
                connection.createChannel((error1, channel) => {
                    if(error1) {
                        throw error1;
                    }
        
                    channel.assertQueue(config.queue, { durable: false })
                    this.logger.info(` [${params.name}] Waiting for messages in ${config.queue}. To exit press CTRL+C`)
                    channel.consume(config.queue, (message) => {
                        this.logger.info(` [${params.name}] Received ${message.content.toString()}`, );
                    }, {noAck: true});
                });
    
            });
        }
        catch (error) {
            this.logger.info("Error occurred: " + error);
        }
    }
};