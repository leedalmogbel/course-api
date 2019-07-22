// Dependencies
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');

/**
 * Bootstrap Middleware
 * 
 * @param {Object} app 
 * @param {Object} express 
 */
module.exports = (app, express) => {
  app.use(logger('dev'));
  app.use(cookieParser());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, '../public')));
  app.use(cors());
};