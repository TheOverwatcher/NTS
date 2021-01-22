# NTS
Node Test Server is a basic node server with the ability to accept requests to 
http://localhost:8088/test. It is meant to be a quick setup server to test other
application's ability to send to the configured url, such as a webhook from a 3rd
party application sending an event message.

## Prerequisites 
Download and install [RabbitMQ](https://www.rabbitmq.com/download.html).

## Configuration
The config.json file has the following properties that are required for NTS to 
run without error.

- **queue**: the name of the RabbitMQ queue to send and receive messages
- **consumer**:
    -   **workerCount**: the amount of consumers to start up when starting NTS
- **log**: 
    - **errorFile**: the path and name of the error file when logging occurs
    - **logFile**: the path and name of the output file when logging occurs
    - **format**:
        - **label**: easy configuration of log labels for extensions of NTS
- **test**:
    - **filename**: name of the file that outputs the last received request body