const amqp = require('amqplib');
const ConsumerService = require('./consumerService.js');

module.exports = class QueueUtil {
    constructor(args) {
        this.logger = args.logger;
        this.consumerService = new ConsumerService({"logger":this.logger});
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
            this.logger.info(' [x] error connecting to rabbitmq')
            this.logger.info(error);
        }
        
    }

    async getPublisher() {
        if(this.publisher === undefined) await this.startPublisher();
        return this.publisher;
    }
};