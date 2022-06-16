const winston = require('winston')
const expressWinston = require('express-winston')
const { defaultFormat, stringFormat } = require('../services/logger.service')
const config = require('../config')

// read more about the full properties here https://www.npmjs.com/package/express-winston
const transports = [
  new winston.transports.File({ filename: 'logs/log.log' }),
  new winston.transports.Console({ format: stringFormat }),
]
if (!config.isDev && config.logzioToken) {
  const LogzioWinstonTransport = require('../services/logzio.service');
  transports.push(LogzioWinstonTransport)
}
const logger = expressWinston.logger({
  transports,
  format: defaultFormat,
  meta: true, // (default to true)
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: false,
})

// req.body is by default not included because it will often contain things that shouldn't 
// be logged like passwords, so be sure you want to do it before you do.
expressWinston.requestWhitelist.push('body');

module.exports = logger
