// Routers
const index = require('@routes/index');
const auth = require('@routes/auth');
const history = require('@routes/history');
const user = require('@routes/user');
const course = require('@routes/course');

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
  app.use('/course', course);
};