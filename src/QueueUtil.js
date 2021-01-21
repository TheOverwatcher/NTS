const amqp = require('amqplib');
const ConsumerService = require('./consumerService.js');

module.exports = class QueueUtil {
    constructor() {
        this.consumerService = new ConsumerService();
    }

    startConsumerService() {
        this.consumerService.start();
    }

    async startPublisher() {
        try {
            this.open = amqp.connect('amqp://localhost');
            this.publisher = await this.open.then((connection) => {
                return connection.createChannel();
            })
        }
        catch (error) {
            console.log(' [x] error connecting to rabbitmq')
            console.log(error);
        }
        
    }

    async getPublisher() {
        if(this.publisher === undefined) await this.startPublisher();
        return this.publisher;
    }
};