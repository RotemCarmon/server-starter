const { db } = require('../config')
const loggerService = require('./logger.service')
const connectMongodb = require('connect-mongodb-session')


module.exports.setup = (session) => {

  const MongoDBStore = connectMongodb(session);

  return new MongoDBStore({
    uri: db.url,
    databaseName: db.dbName,
    collection: 'session'
  }, (err) => {
    if (err) {
      loggerService.error('ERROR mongoDBStore can\'t connect ' + err)
    }
  });

}