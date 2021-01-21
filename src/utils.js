const winston = require('winston');
const config = require('../config.json');
const DEBUG = true;

// Format the logs for the winstone logger based on the parameters
const logFormat =  winston.format.printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.label({label:config.log.format.label}),
        winston.format.timestamp(),
        logFormat
    ),
    defaultMeta: {service: 'user-service'},
    transports: [
        new winston.transports.File({
            filename: config.log.errorFile,
            level: 'error'}),
        new winston.transports.File({filename: config.log.logFile})
    ]
});

// If we are debugging, then log the output when PADS processes a request
if (DEBUG) {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
        winston.format.label({label:config.log.format.label}),
        winston.format.timestamp(),
        logFormat
        )
    }));
}

exports.logger = logger;
