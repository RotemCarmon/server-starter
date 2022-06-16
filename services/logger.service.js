const fs = require('fs');
const { createLogger, format, transports } = require('winston');
const { printf } = format;
const asyncLocalStorage = require('../services/als.service')
const config = require('../config')
// const rotateTransport = require('./rotateLogger.service');


const logsdir = './logs';
if (!fs.existsSync(logsdir)) {
    fs.mkdirSync(logsdir);
}

//define the time format
const timeFormatFn = () => {
    let now = new Date();
    return now.toUTCString();
};


function getTraceId() {
    const store = asyncLocalStorage.getStore()
    return (store && store.traceID) ? `[TraceID: ${store.traceID}] ` : ''
}

const defaultFormat = printf((info) => {
    const statusCode = (info.meta?.res.statusCode) ? ` - ${info.meta?.res.statusCode}` : ''
    info.env = config.env
    return `[${timeFormatFn()}] ${info.level.toUpperCase()} - ${info.message}${statusCode}`
})

const stringFormat = printf((info) => {
    const traceID = getTraceId()
    const { level, message } = info
    const statusCode = (info.meta?.res.statusCode) ? ` - ${info.meta?.res.statusCode}` : ''
    return `[${timeFormatFn()}] ${traceID}${level.toUpperCase()} - ${message}${statusCode}`
})


const logger = createLogger({
    level: 'info',
    format: defaultFormat,
    defaultMeta: {
        service: 'api',
    },
    transports: [
        new transports.File({ filename: 'logs/log.log' }),
        new transports.Console({
            format: stringFormat,
            level: 'debug',
        })
    ]
})

// if (!config.isDev && config.env !== 'test' && config.logzioToken) {
//     const LogzioWinstonTransport = require('./logzio.service');
//     logger.add(LogzioWinstonTransport)
// }

async function getLogs(tail = 10000) {
    return new Promise((resolve, reject) => {
        fs.readFile('logs/log.log', 'utf-8', (err, data) => {
            if (err) {
                logger.log('error', err, true);
                reject(err);
            }
            return resolve(data.split('\r\n').filter(Boolean).slice(-tail).join('\r\n'))
        })
    })
}

module.exports = {
    debug: (message) => {
        logger.log('debug', message, true);
    },

    info: (message) => {
        logger.log('info', message, true);
    },

    warn: (message) => {
        logger.log('warn', message, true);
    },

    error: (message) => {
        logger.log('error', message, true);
    },
    defaultFormat,
    stringFormat,
    getLogs

}