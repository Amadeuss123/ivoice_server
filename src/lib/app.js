const bodyParser = require('body-parser');
const expressPinoLogger = require('express-pino-logger');
const expressFormidable = require('express-formidable');
const pino = require('pino');
const express = require('express');
const compression = require('compression');
const helmet = require('helmet');
const appLog = require('./log/app_log');
const ResponseUtils = require('./response-utils');
const fs = require('fs');
const favicon = require('serve-favicon');
const session = require('express-session');
const authStrategies = require('./auth');
const FileStore = require('session-file-store')(session);
const MemoryStore = require('memorystore')(session);
const SequelizeStore = require('connect-session-sequelize')(session);
const RedisStore = require('connect-redis')(session);
const passport = require('passport');
const path = require('path');
const redis = require('redis');

async function makeApp(config, models) {
  if (typeof config.get !== 'function') {
    throw new Error('config is required');
  }
  if (!models) {
    throw new Error('models is required');
  }

  const pinoLogger = expressPinoLogger({
    level: config.get('webLogLevel'),
    timestamp: pino.stdTimeFunctions.isoTime,
    name: 'ivoice',
    redact: {
      paths: [
        'req.headers',
        'res.headers',
        'req.remoteAddress',
        'req.remotePort',
      ],
      remove: true,
    },
  });

  const app = express();
  app.use(compression());

  app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'PUT, GET, POST, DELETE, OPTIONS'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
  });

  app.use(helmet());

  app.use((req, res, next) => {
    req.config = config;
    req.models = models;
    req.appLog = appLog;
    res.utils = new ResponseUtils(res, next);

    next();
  });

  app.use(pinoLogger);

  const icoPath = path.join(__dirname, '/public/favicon.ico');
  if (fs.existsSync(icoPath)) {
    app.use(favicon(icoPath));
  }

  app.use(bodyParser.json());
  app.use(
    bodyParser.urlencoded({
      extended: true,
    })
  );
  app.use(expressFormidable());

  // 设置session
  const cookieMaxAge = parseInt(config.get('sessionMinutes'), 10) * 60 * 1000;
  const sessionOptions = {
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: { maxAge: cookieMaxAge },
    secret: config.get('cookieSecret'),
    name: config.get('cookieName'),
  };
  const sessionStore = config.get('sessionStore').toLowerCase();
  switch (sessionStore) {
    case 'file': {
      const sessionPath = path.join(config.get('dbPath'), '/sessions');
      sessionOptions.store = new FileStore({
        path: sessionPath,
        logFn: () => {},
      });
      break;
    }
    case 'memory': {
      sessionOptions.store = new MemoryStore({
        checkPeriod: cookieMaxAge,
      });
      break;
    }
    case 'database': {
      sessionOptions.store = new SequelizeStore({
        db: models.sequelizeDb.sequelize,
        table: 'Sessions',
      });
      // SequelizeStore supports the touch method so per the express-session docs this should be set to false
      sessionOptions.resave = false;
      // SequelizeStore docs mention setting this to true if SSL is done outside of Node
      // Not sure we have any way of knowing based on current config
      // sessionOptions.proxy = true;
      break;
    }
    case 'redis': {
      const redisClient = redis.createClient(config.get('redisUri'));
      sessionOptions.store = new RedisStore({ client: redisClient });
      sessionOptions.resave = false;
      break;
    }
    default: {
      throw new Error(`Invalid session store ${sessionStore}`);
    }
  }

  app.use(session(sessionOptions));

  app.use(express.static(path.join(__dirname, 'public')));

  const baseUrl = config.get('baseUrl');

  // 设置passport
  await authStrategies(config, models);
  app.use(passport.initialize());
  app.use(passport.session());

  // TODO 添加路由

  const routers = [
    require('../routers/audio'),
    require('../routers/results'),
    require('../routers/signin'),
    require('../routers/signup'),
    require('../routers/tasks'),
    require('../routers/users'),
  ];

  routers.forEach((router) => app.use(baseUrl, router));

  app.use(baseUrl + '/api/', function (req, res) {
    req.log.debug('reached catch all api route');
    return res.utils.notFound();
  });

  // Add an error handler for /api
  app.use(baseUrl + '/api/', function (err, req, res, next) {
    if (res.headersSent) {
      return next(err);
    }
    appLog.error(err);
    return res.status(500).json({
      title: 'Internal Server Error',
    });
  });

  const indexTemplatePath = path.join(__dirname, 'public/index-template.html');

  if (fs.existsSync(indexTemplatePath)) {
    const html = fs.readFileSync(indexTemplatePath, 'utf8');
    // const baseUrlHtml = html
    //   .replace(/="\/stylesheets/g, `="${baseUrl}/stylesheets`)
    //   .replace(/="\/javascripts/g, `="${baseUrl}/javascripts`)
    //   .replace(/="\/images/g, `="${baseUrl}/images`)
    //   .replace(/="\/fonts/g, `="${baseUrl}/fonts`)
    //   .replace(/="\/static/g, `="${baseUrl}/static`);
    app.use((req, res) => res.send(html));
  } else {
    const msg =
      'No UI template detected. Build client/ and copy files to server/public/';
    appLog.warn(msg);
    app.use((req, res) => {
      appLog.warn(msg);
      res.status(404).send(msg);
    });
  }

  return app;
}

module.exports = makeApp;
