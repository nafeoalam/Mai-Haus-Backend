
// Define routes for the Node backend

//Authentication Api
import GameRoutes from './routes/game.router.js'
import DashboardRoutes from './routes/authRoutes/dashboard.router'
//import FileUploadRoutes from './routes/authRoutes/fileUpload.router'
import jwtAuthRoutes from './routes/jwtAuth'


import cors from 'cors';
import useragent from 'express-useragent';
import log4js from 'log4js';

import authorize from "./../app/middleware/authorize";
import validInfo from "./middleware/validInfo";


export default (app, router, client) => {

  // Redis Cache Server
  app.use(useragent.express());

  // ### Express Middlware to use for all requests
  router.use((req, res, next) => {
    // Make sure we go to the next routes and don't stop here...
    next();
  });

  let logger = function (log_for) {
    return (req, res, next) => {
      let file_name = 'logs/' + log_for + '.log';
      log4js.configure({
        appenders: {
          everything: {
            type: 'dateFile',
            filename: file_name,
            pattern: '.yyyy-MM-dd-hh',
            compress: false
          }
        },
        categories: {
          default: {
            appenders: ['everything'],
            level: 'debug'
          }
        }
      });
      req.log = log4js.getLogger(log_for);
      next();
    }
  }


  // For mobile app api
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)

    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
  });

  // Pass in our Express app and Router
  //authRoutes(app, router, passport, auth);

  GameRoutes(app, router, client, logger);
  jwtAuthRoutes(app, router, client, authorize, validInfo);
  DashboardRoutes(app, router, client, logger, authorize);
  //FileUploadRoutes(app, router, client, logger, authorize);



  // dynamiPagesRoutes(app, router, auth);
  // All of our routes will be prefixed with /api


  app.use('/api', router);

};
