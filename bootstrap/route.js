// Routers
const index = require('@routes/index');
const auth = require('@routes/auth');
const history = require('@routes/history');
const user = require('@routes/user');

/**
 * Bootstrap Route
 *
 * @param {Object} app
 * @param {Object} express
 */
module.exports = (app, express) => {
  app.use('/', index);
  app.use('/auth', auth);
  app.use('/history', history);
  app.use('/user', user);
};