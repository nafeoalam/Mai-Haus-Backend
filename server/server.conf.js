// # Node Env Variables

// Load Node environment variable configuration file
import {
    validateEnvVariables
} from '../config/env.conf.js';

// Set up appropriate environment variables if necessary
validateEnvVariables();


// Middlewares
import Messages from "../app/middleware/messages";

// Load Express
import express from 'express';
import cors from "cors";

import device from 'express-device';
// Load Socket.io
import socketio from 'socket.io';
// Load Node http module
import http from 'http';
// Create our app with Express
let app = express();
// Create a Node server for our Express app
let server = http.createServer(app);
// Integrate Socket.io
let io = socketio.listen(server);

// Log requests to the console (Express 4)
import morgan from 'morgan';
// Pull information from HTML POST (express 4)
import bodyParser from 'body-parser';
// Simulate DELETE and PUT (Express 4)
import methodOverride from 'method-override';
// PassportJS
//import passport from 'passport';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import compression from 'compression';


import path from 'path';
import { Client, Pool } from 'pg';

// # Configuration

// Load Socket.io server functionality
import base from '../sockets/base';

base(io);





//-------------------------------------------------

// Set the port for this app
let port = process.env.PORT || 4000;

// Import PassportJS configuration
//import passportConf from './config/passport.conf.js';

// Pass Passport configuration our PassportJS instance
//passportConf(passport);

if (process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'test')
    // Log every request to the console
    app.use(morgan('dev'));

// Read cookies (needed for authentication)
app.use(cookieParser());
app.use(device.capture());

app.use(cors());
// app.use(express.json());

// ## Get all data/stuff of the body (POST) parameters

// Parse application/json
app.use(bodyParser.json());
// Parse application/vnd.api+json as json
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));



// Override with the X-HTTP-Method-Override header in the request. Simulate DELETE/PUT
app.use(methodOverride('X-HTTP-Method-Override'));

// gzip compression
app.use(compression({
    filter: shouldCompress
}));

function shouldCompress(req, res) {
    if (req.headers['x-no-compression']) {
        return false
    }
    // fallback to standard filter function
    return compression.filter(req, res);
}

app.disable('etag');
// ## Passport JS

// Session secret
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));


//DB Connection string
// var connectionString = PostGreConnectionString;
const connectionString = process.env.MaiHausConnectionString;

// Connect to POSTGRES --------------------------
const client = new Client({
    connectionString: connectionString
})

client.connect();
//app.use(passport.initialize());

// Persistent login sessions
//app.use(passport.session());

// ## Routes

// Get an instance of the express Router
let router = express.Router();
//let adminRouter = express.Router();

// Load our application API routes
// Pass in our express and express router instances
import routes from '../app/routes';
// import adminRoutes from './app/admin.routes';
// import uploadRoutes from './app/uploads.routes';

// Pass in instances of the express app, router, and passport
//adminRoutes(app, adminRouter, passport);
//uploadRoutes(app, router);
routes(app, router, client);

// ### Ignition Phase

server.listen(port);

// Shoutout to the user

Messages.success(`Server is running on port ${port}`);

// Expose app
export {
    app,
    client
};