// Config
const paths = require('@config/paths');
const services = require('@config/services');
const settings = require('@config/settings');

/**
 * Bootstrap Environment
 * 
 * @param {Object} app 
 * @param {Object} express 
 */
module.exports = (app, express) => {
  // Attach to process
  process.PATHS = paths;
  process.SERVICES = services;
  process.SETTINGS = settings;
  process.env.NODE_ENV = settings.env;
};