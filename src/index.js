const fs = require('fs');
const express = require('express');
const amqp = require('amqplib/callback_api');

const app = express();

app.use(express.json());

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

    console.log('Setup connection to RabbitMQ');
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
                var message = 'Hello World';

                channel.assertQueue(queue, { durable: false })

                channel.sendToQueue(queue, Buffer.from(message));
                console.log(' [x] sent %s', message)
            });
            // Can this be done in a finally
            setTimeout(() => {
                connection.close();
                process.exit(0);
            }, 500)

        });
    }
    catch (error) {
        console.log("Error occurred: " + error);
    }
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
