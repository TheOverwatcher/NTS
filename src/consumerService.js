
const amqp = require('amqplib/callback_api');
const config = require('../config.json')

module.exports = class ConsumerService {
    constructor() {

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
                    console.log(` [${params.name}] Waiting for messages in ${config.queue}. To exit press CTRL+C`)
                    channel.consume(config.queue, (message) => {
                        console.log(` [${params.name}] Received ${message.content.toString()}`, );
                    }, {noAck: true});
                });
    
            });
        }
        catch (error) {
            console.log("Error occurred: " + error);
        }
    }
};