const logger = require('../services/logger.service')
const { MongoClient, ObjectId } = require('mongodb');

const config = require('../config');
const DB_NAME = config.db.dbName;
const DB_URL = config.db.url;


var dbConn = null;
var client = null;


/**
 * @returns {Object} MongoBd connection
 */
async function connect() {
  if (dbConn) return dbConn;
  dbConn = connectToDb(DB_URL, DB_NAME);
  dbConn.catch(err => dbConn = null);
  return dbConn;
}

/**
* This function creates a connection to the db;
* if connection is already exists - returns the old connection from cash;
* @param {String} dbUrl 
* @param {String} dbName 
* @returns 
*/
async function connectToDb(dbUrl = DB_URL, dbName = DB_NAME) {
  try {
    const url = dbUrl;
    client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = client.db(dbName);
    logger.info('DB connected Successfuly')
    return db;
  } catch (err) {
    logger.error('Cannot Connect to DB ' + err)
    throw err;
  }
}

// This function disconnect the db;
async function disconnect() {
  if (!client) return;
  await client.close();
  client = dbConn = null;
}

/**
 * @param {String} collectionName the name of the required collection from the db;
 * @returns {Object} mongoDb collection object
 */
 async function getCollection(collectionName) {
  const db = await connect()
  return db.collection(collectionName);
}

async function query(collectionName, filterBy = {}, sortBy = {}) {
  const collection = await getCollection(collectionName);
  return collection.find(filterBy).sort(sortBy).toArray();
}


async function queryForPagination(collectionName, filterBy = {}, sortBy = {}, limit = 0, page = 0) {
  const collection = await getCollection(collectionName);

  let itemsPrm = collection.find(filterBy).sort(sortBy);
  const total = await itemsPrm.count()
  if (page && limit) itemsPrm = itemsPrm.skip(page * limit);
  if (limit) itemsPrm = itemsPrm.limit(limit);
  const items = await itemsPrm.toArray();
  return { items, total };
}

async function updateOne(collectionName, _id, fields, upsert = false) {
  const collection = await getCollection(collectionName);
  if (Object.keys(fields).includes('_id')) delete fields._id;
  await collection.updateOne({ "_id": ObjectId(_id) }, { $set: fields }, { upsert });
  const res = await get(collectionName, _id)
  return res
}

async function get(collectionName, id) {
  const collection = await getCollection(collectionName)
  const item = await collection.findOne({ "_id": ObjectId(id) });
  return item;
}

async function save(collectionName, item) {
  const collection = await getCollection(collectionName)
  if (item._id) {
      item._id = ObjectId(item._id);
      await collection.updateOne({ "_id": ObjectId(item._id) }, { $set: item });
      return item;
  }
  await collection.insertOne(item);
  return item;
}

async function remove(collectionName, id) {
  const collection = await getCollection(collectionName);
  await collection.deleteOne({ "_id": ObjectId(id) });
  return id;
}

async function insertMany(collectionName, items) {
  const collection = await getCollection(collectionName);
  await collection.insertMany(items);
  return items;
}

module.exports = {
  connect,
  connectToDb,
  disconnect,
  getCollection,
  query,
  queryForPagination,
  save,
  remove,
  insertMany,
  updateOne,
  get,
  ObjectId
}