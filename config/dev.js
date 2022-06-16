module.exports = {
  env: process.env.NODE_ENV || 'development',
  isDev: true,
  db: {
    dbName: '',
    url: process.env.DB_URL || 'mongodb://localhost:27017',
  },  
}

