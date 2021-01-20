
const amqp = require('amqplib/callback_api');

module.exports = class Consumer {
    constructor() {

    }

    start() {
        try {
            amqp.connect('amqp://localhost', (error0, connection) => {
                if(error0) {
                    throw error0;
                }
    
                connection.createChannel((error1, channel) => {
                    if(error1) {
                        throw error1;
                    }
    
                    var queue = 'hello';
    
                    channel.assertQueue(queue, { durable: false })
                    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue)
                    channel.consume(queue, (message) => {
                        console.log(' [x] Received %s', message.content.toString());
                    }, {noAck: true});
                });
    
            });
        }
        catch (error) {
            console.log("Error occurred: " + error);
        }
    }
};