const express = require('express')
const cors = require('cors')
const path = require('path')
const logger = require('./services/logger.service')
const expressWinston = require('./middlewares/express-winston.middleware')
const expressSession = require('express-session')

const app = express()
const http = require('http').createServer(app)

// Store session in mongodb
const mongoDBStoreService = require('./services/mongodb-store.service')
const store = mongoDBStoreService.setup(expressSession)


// SESSION
const session = expressSession({
  secret: 'very top secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store
})

// MIDDLEWARES
app.use(express.json())
app.use(expressWinston);
app.use(session)


// #######################
// ### FOR SERVING UI ###
// if (process.env.NODE_ENV === 'production') {
//   app.use(express.static(path.resolve(__dirname, 'public')));
// } else {
//   const corsOptions = {
//       origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:8081', 'http://localhost:8081', 'http://127.0.0.1:3000', 'http://localhost:3000'],
//       credentials: true
//   };
//   app.use(cors(corsOptions));
// }
// #######################


// LOGS
app.get('/api/logs', async (req, res) => {
  const tail = req.query.tail
  const logs = await logger.getLogs(tail)
  res.send(`<pre>${logs}</pre>`)
})

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.send('Successfully connected to the server!!!')
})

// DEFAULT ERROR HANDLER
const errorHandler = require('./middlewares/error-handler.middleware');
app.use(errorHandler);

module.exports = http;